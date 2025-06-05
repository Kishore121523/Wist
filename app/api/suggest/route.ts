import { NextRequest, NextResponse } from "next/server";
import { adminDB, adminAuth } from "@/firebase/firebaseAdmin";
import { AzureOpenAI } from "openai";
import { isSameDay } from "date-fns";

export const dynamic = "force-dynamic";

// Azure setup
const endpoint = process.env.AZURE_O3_MINI_ENDPOINT!;
const apiKey = process.env.AZURE_O3_MINI_KEY!;
const apiVersion =
  process.env.AZURE_O3_MINI_API_VERSION! || "2024-12-01-preview";
const deployment = process.env.AZURE_O3_MINI_DEPLOYMENT_NAME!;

const client = new AzureOpenAI({
  endpoint,
  apiKey,
  apiVersion,
  deployment,
});

export async function POST(req: NextRequest) {
  try {
    // Auth validation
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split("Bearer ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await adminAuth.verifyIdToken(token);
    const uid = decoded.uid;

    const { title, category, userQuery } = await req.json();

    if (!title || !category) {
      return NextResponse.json(
        { error: "Missing title or category" },
        { status: 400 }
      );
    }

    // Usage tracking
    const usageRef = adminDB.doc(`users/${uid}/limits/aiUsage`);
    const usageSnap = await usageRef.get();
    const now = new Date();

    let count = 0;
    let lastReset: Date | null = null;

    if (usageSnap.exists) {
      const data = usageSnap.data();
      count = data?.count ?? 0;
      lastReset = data?.lastReset?.toDate() ?? null;

      // Reset daily count if new day
      if (!lastReset || !isSameDay(now, lastReset)) {
        count = 0;
        await usageRef.update({
          count: 0,
          lastReset: now,
        });
      }

      if (count >= 20) {
        return NextResponse.json(
          { error: "Daily limit of 20 suggestions reached." },
          { status: 429 }
        );
      }
    }

    // Prompt construction
    const prompt = `You are a structured and helpful planning assistant that generates motivational action plans in clean HTML for personal bucket list goals.

    Follow this exact format in your HTML output:
    1. Begin with a centered <h1> tag containing the goal title exactly as provided.
    2. Include a <ul> block with 4–6 <li> items. Each item must:
      - Begin with a bullet point (default <li> style).
      - Be 1–2 full sentences.
      - Provide clear, motivational, and practical steps tailored to the goal.
    3. Add a single <p> after the list that summarizes the overall plan and encourages the user to take action.
    4. If a follow-up question is provided, add another <p> at the end:
      - Begin the paragraph directly with a complete, helpful answer to the question.
      - You may include <ul> inside this <p> for clarity if listing tips.

    Constraints:
    - Use valid HTML only, no Markdown or text outside tags.
    - No emojis, quotes, or unrelated content.
    - Format strictly in HTML with no extra explanation.

    Goal Title: ${title}
    Category: ${category}
    ${userQuery ? `Follow-up Question: ${userQuery}` : ""}`;

    const completion = await client.chat.completions.create({
      model: deployment,
      messages: [
        {
          role: "system",
          content:
            "You are a thoughtful and inspiring planning assistant that helps users break down their personal bucket list goals into practical and motivating steps. Focus on clarity, encouragement, and relevance.",
        },
        { role: "user", content: prompt },
      ],
      max_completion_tokens: 100000,
    });

    const result =
      completion.choices[0]?.message?.content?.trim() ??
      "No suggestion returned.";

    const wrappedResult = `<!-- AI_START -->\n${result}\n<!-- AI_END -->`;

    // Increment usage count
    await usageRef.set(
      {
        count: count + 1,
        lastUsedAt: now.toISOString(),
        lastReset: lastReset ?? now,
      },
      { merge: true }
    );

    return NextResponse.json({ result: wrappedResult });
  } catch (err) {
    console.error("Suggest API error:", (err as Error)?.message || err);
    return NextResponse.json(
      { result: "AI generation failed. Please try again." },
      { status: 500 }
    );
  }
}

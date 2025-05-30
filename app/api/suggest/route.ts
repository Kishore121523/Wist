import { NextRequest, NextResponse } from "next/server";
import { AzureOpenAI } from "openai";

export const dynamic = "force-dynamic";

const endpoint =
  "https://kisho-mb9gsffa-swedencentral.cognitiveservices.azure.com/";
const apiKey =
  "AD7wCgoTlmBygN4gfgN9w9y4FB6uArfuJJzKrttjBQdQAopvvnlSJQQJ99BEACfhMk5XJ3w3AAAAACOGbPck";
const apiVersion =
  process.env.AZURE_O3_MINI_API_VERSION! || "2024-12-01-preview";
const deployment = "o3-mini";

const client = new AzureOpenAI({
  endpoint,
  apiKey,
  apiVersion,
  deployment,
});

export async function POST(req: NextRequest) {
  try {
    const { title, category, userQuery } = await req.json();

    if (!title || !category) {
      return NextResponse.json(
        { error: "Missing title or category" },
        { status: 400 }
      );
    }

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
      - Do not rephrase, restate, or reference the original question.
      - You may include <ul> inside this <p> for clarity if listing tips.
    
    Constraints:
    - Use valid, semantic HTML only.
    - Do not include block quotes, inspirational quotes, emojis, or external references.
    - Do not duplicate content across sections.
    - Do not invent information unrelated to the provided goal or question.
    - Format the output as pure HTML — do not include Markdown or text outside tags.
    
    Goal Title: ${title}
    Category: ${category}
    ${userQuery ? `Follow-up Question: ${userQuery}` : ""}
    
    Respond only with properly formatted HTML that matches the structure above. Do not include explanations or extra notes.`;

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
    return NextResponse.json({ result: wrappedResult });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(
      "Azure OpenAI Error:",
      err?.response?.data || err?.message || err
    );
    return NextResponse.json(
      { result: "AI generation failed. Please try again." },
      { status: 500 }
    );
  }
}

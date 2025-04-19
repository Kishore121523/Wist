import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Timestamp } from "firebase/firestore";
import { differenceInCalendarDays, isAfter, isBefore } from "date-fns";
import { Editor } from "@tiptap/core";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// dashboard/page.tsx
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  else return "Good evening";
}

export const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: 12,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

// bucket/[id]/page.tsx
export function formatUpdatedAt(
  updatedAt: Date | Timestamp | undefined
): string | null {
  if (!updatedAt) return null;

  const date = updatedAt instanceof Timestamp ? updatedAt.toDate() : updatedAt;

  return date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function getRandomImage(images: string[]) {
  return images[Math.floor(Math.random() * images.length)];
}

// dateinputwithcountdown.tsx
export function calculateCountdownFill(
  start: Date,
  today: Date,
  maxDays = 30
): number {
  const totalDays = differenceInCalendarDays(start, today);
  return Math.max(0, Math.min(100, ((maxDays - totalDays) / maxDays) * 100));
}

export function getCountdownMessage(fill: number): string {
  if (fill >= 100) return "Today’s the day! Let’s go!";
  if (fill >= 76) return "Almost there! Get pumped!";
  if (fill >= 51) return "Not long now, stay ready!";
  if (fill >= 21) return "You’re warming up nicely!";
  return "Still early, perfect time to plan!";
}

export function validateDateOrder(
  start?: Date,
  end?: Date
): {
  showStartError: boolean;
  showEndError: boolean;
} {
  return {
    showStartError: !!start && !!end && isAfter(start, end),
    showEndError: !!end && !!start && isBefore(end, start),
  };
}

// Planningeditor.tsx
export const getActiveHeadingLabel = (editor: Editor): string => {
  if (!editor) return "";
  if (editor.isActive("heading", { level: 1 })) return "H1";
  if (editor.isActive("heading", { level: 2 })) return "H2";
  if (editor.isActive("heading", { level: 3 })) return "H3";
  if (editor.isActive("taskList")) return "Task List";
  if (editor.isActive("paragraph")) return "Paragraph";
  return "";
};

//bukcetlistcard.tsx
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatDate = (date?: any) => {
  if (!date?.toDate) return "";
  return date.toDate().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getPriorityBadgeStyle = (priority: string, completed: boolean) => {
  if (completed)
    return "border border-foreground/80 text-foreground font-medium";
  if (priority === "High") return "bg-card-dark text-background";
  if (priority === "Medium") return "bg-card-dark/65 text-background";
  return "bg-card-dark/45 text-background";
};

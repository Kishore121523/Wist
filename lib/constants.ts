// Select input styles
export const formInputStyle =
  "w-full border border-border rounded-[6px] focus-visible:border-border focus-visible:outline-none focus-visible:ring-0 focus:outline-none focus:ring-0";

export const selectItemInputStyle =
  "cursor-pointer rounded-[6px] data-[highlighted]:bg-muted data-[highlighted]:rounded-[3px]";

export const selectTriggerStyle =
  "w-full border border-border rounded-[6px] cursor-pointer focus-visible:outline-none focus-visible:ring-0 focus-visible:border-border focus:outline-none focus:ring-0";

// Button styles
export const btnWhiteBg =
  "border border-foreground cursor-pointer text-foreground px-4 py-2 rounded-[6px] text-[12px] font-medium hover:bg-card-dark hover:text-background transition";

export const btnBlackBg =
  "bg-card-dark text-background px-4 py-2 rounded-[6px] text-[12px] font-medium cursor-pointer border border-foreground hover:bg-foreground transition duration-200 ease-in-out";

export const btnRedBg =
  "border border-foreground bg-destructive text-destructive-foreground px-4 py-2 rounded-[6px] text-[12px] font-medium hover:bg-red-500 hover:text-white hover:border-red-500 transition cursor-pointer";

export const editorButtonStyle = (active: boolean) =>
  active
    ? "bg-card-dark text-background cursor-pointer rounded-[6px] hover:bg-foreground hover:text-background transition"
    : "border border-foreground-muted cursor-pointer rounded-[6px] text-foreground hover:bg-card-dark hover:text-background transition";

import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The design system's type scale uses names tailwind-merge doesn't ship with
 * (`text-body`, `text-caption`, …). Left undeclared, tailwind-merge guesses
 * they are text *colours* and drops a real colour that appears earlier in the
 * list — which silently stripped `text-on-accent` from primary buttons.
 * Declaring them as font sizes keeps size and colour in separate groups.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: ["display", "title-1", "title-2", "title-3", "body", "caption", "micro"],
        },
      ],
    },
  },
});

/** Merge conditional class names, letting later Tailwind utilities win. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { IconButton } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/menu";

type Theme = "light" | "dark";

const THEME_KEY = "cadabry:theme";
const THEME_EVENT = "cadabry:theme";

/**
 * The theme's source of truth is the DOM attribute written before first paint
 * by the inline script in the root layout. React does not own it, so we
 * subscribe to it — the same model the universe view preference uses.
 */
const themeStore = {
  subscribe(onChange: () => void) {
    window.addEventListener(THEME_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(THEME_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  },
  get(): Theme {
    return document.documentElement.dataset.theme === "light" ? "light" : "dark";
  },
  set(next: Theme) {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Private mode: the switch still works for this session.
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  },
};

/**
 * The sky switch. The inline init script replays the stored choice before
 * first paint, so a reload never flashes the wrong theme.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(themeStore.subscribe, themeStore.get, () => "dark" as Theme);
  const isDark = theme === "dark";

  return (
    <Tooltip content={isDark ? "Star chart (light)" : "Night sky (dark)"}>
      <IconButton
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        aria-pressed={!isDark}
        size="sm"
        onClick={() => themeStore.set(isDark ? "light" : "dark")}
        className={className}
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </IconButton>
    </Tooltip>
  );
}

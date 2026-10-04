"use client";

import { Moon, Sun } from "lucide-react";

import { IconButton } from "@/components/ui/icon-button";
import { useThemeMode } from "@/hooks/use-theme-mode";

type ThemeToggleButtonProps = {
  className?: string;
};

/** Moon in dark (tap → light); Sun in light (tap → dark). */
export function ThemeToggleButton({ className }: ThemeToggleButtonProps) {
  const { theme, toggleTheme } = useThemeMode();
  const isDark = theme === "dark";

  return (
    <IconButton
      size="responsive"
      className={className}
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </IconButton>
  );
}

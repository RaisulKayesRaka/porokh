"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-9 w-[100px] rounded-full border border-border/50 bg-muted/30" />;
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-border/50 bg-muted/30 p-1">
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full transition-all",
          theme === "light"
            ? "bg-background border border-black/10 dark:border-white/10 text-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent"
        )}
        title="Light Mode"
      >
        <Sun className="h-4 w-4" />
        <span className="sr-only">Light</span>
      </button>
      <button
        onClick={() => setTheme("system")}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full transition-all",
          theme === "system"
            ? "bg-background border border-black/10 dark:border-white/10 text-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent"
        )}
        title="System Default"
      >
        <Monitor className="h-4 w-4" />
        <span className="sr-only">System</span>
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full transition-all",
          theme === "dark"
            ? "bg-background border border-black/10 dark:border-white/10 text-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent"
        )}
        title="Dark Mode"
      >
        <Moon className="h-4 w-4" />
        <span className="sr-only">Dark</span>
      </button>
    </div>
  );
}

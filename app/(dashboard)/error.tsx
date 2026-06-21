"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error("Dashboard caught error:", error);
  }, [error]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-4 p-8 text-center min-h-[50vh]">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100/10 text-red-500">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        Something went wrong!
      </h2>
      <p className="text-sm text-muted-foreground max-w-[500px]">
        An unexpected error occurred while loading this page. We've been notified and are looking into it.
      </p>
      <div className="flex gap-4 pt-4">
        <Button onClick={() => reset()} variant="default">
          Try again
        </Button>
      </div>
    </div>
  );
}

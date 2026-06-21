"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error("Main route caught error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-4 p-8 text-center w-full">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100/10 text-red-500">
        <AlertCircle className="h-10 w-10" />
      </div>
      <h2 className="text-3xl font-bold tracking-tight text-foreground">
        Oops! Something went wrong.
      </h2>
      <p className="text-muted-foreground max-w-[500px]">
        We encountered an unexpected issue. Our team has been notified.
      </p>
      <div className="flex gap-4 pt-6">
        <Button onClick={() => reset()} variant="outline">
          Try again
        </Button>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}

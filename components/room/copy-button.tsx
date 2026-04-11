"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Room code copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy text");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onCopy}
      className="h-8 w-8"
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <Check className="text-green-500" />
      ) : (
        <Copy />
      )}
    </Button>
  );
}

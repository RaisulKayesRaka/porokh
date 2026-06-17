"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { toggleResultsPublished } from "@/app/actions/exam";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PublishResultsToggleProps {
  examId: string;
  initialPublished: boolean;
}

export function PublishResultsToggle({ examId, initialPublished }: PublishResultsToggleProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setIsPending(true);
    const result = await toggleResultsPublished(examId, checked);
    setIsPending(false);

    if (result.error) {
      toast.error(result.error.message || "Failed to update result visibility.");
    } else {
      toast.success(checked ? "Results are now visible to examinees." : "Results have been hidden from examinees.");
      router.refresh();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch 
        id="publish-results" 
        checked={initialPublished}
        onCheckedChange={handleToggle}
        disabled={isPending}
      />
      <Label htmlFor="publish-results" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Publish Results
      </Label>
    </div>
  );
}

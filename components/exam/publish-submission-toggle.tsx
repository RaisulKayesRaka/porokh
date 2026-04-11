"use client";

import { useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { togglePublishSubmission } from "@/app/actions/grading";
import { toast } from "sonner";

interface PublishSubmissionToggleProps {
  submissionId: string;
  isPublished: boolean;
}

export function PublishSubmissionToggle({
  submissionId,
  isPublished,
}: PublishSubmissionToggleProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (checked: boolean) => {
    startTransition(async () => {
      const result = await togglePublishSubmission(submissionId, checked);
      if (result.error) {
        toast.error(result.error.message);
      } else {
        toast.success(
          `Result ${checked ? "published to" : "hidden from"} examinee.`,
        );
      }
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch 
        checked={isPublished} 
        onCheckedChange={handleToggle} 
        disabled={isPending} 
        aria-label="Toggle publish status"
      />
    </div>
  );
}

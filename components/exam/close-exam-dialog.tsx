"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { XCircle, AlertTriangle } from "lucide-react";
import { closeExamEarly } from "@/app/actions/exam";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface CloseExamDialogProps {
  examId: string;
  examTitle: string;
  trigger?: React.ReactNode;
}

export function CloseExamDialog({
  examId,
  examTitle,
  trigger,
}: CloseExamDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const router = useRouter();

  const handleClose = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsClosing(true);

    const { error } = await closeExamEarly(examId);

    setIsClosing(false);

    if (error) {
      toast.error(error.message || "Failed to close exam.");
    } else {
      toast.success("Exam closed successfully.");
      setIsOpen(false);
      router.refresh();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button variant="destructive" size="sm">
            <XCircle /> Close Exam
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" /> Close Exam Early
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you absolutely sure you want to close the exam{" "}
            <span className="text-foreground font-semibold">&quot;{examTitle}&quot;</span>
            ? This will immediately prevent any current or future examinees from
            submitting answers. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isClosing}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleClose}
            disabled={isClosing}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isClosing ? "Closing..." : "Close Exam"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, AlertTriangle } from "lucide-react";
import { deleteExam } from "@/app/actions/exam";

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

interface DeleteExamDialogProps {
  roomId: string;
  examId: string;
  examTitle: string;
  trigger?: React.ReactNode;
  redirectOnSuccess?: boolean;
}

export function DeleteExamDialog({
  roomId,
  examId,
  examTitle,
  trigger,
  redirectOnSuccess = false,
}: DeleteExamDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDeleting(true);

    const { error } = await deleteExam(examId);

    setIsDeleting(false);

    if (error) {
      toast.error(error.message || "Failed to delete exam.");
    } else {
      toast.success("Exam deleted successfully.");
      setIsOpen(false);
      
      if (redirectOnSuccess) {
          router.push(`/rooms/${roomId}/exams`);
      } else {
          router.refresh(); // Just refresh the list if we are in the list view
      }
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button variant="destructive" size="sm">
            <Trash2 /> Delete Exam
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
             <AlertTriangle className="h-5 w-5" /> Delete Exam
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you absolutely sure you want to delete the exam{" "}
            <span className="font-semibold text-foreground">&quot;{examTitle}&quot;</span>? 
            This action cannot be undone. All questions, examinee submissions, and grades will be permanently erased.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete Exam"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Settings, Trash2, XCircle, MoreVertical } from "lucide-react";
import { DeleteExamDialog } from "@/components/exam/delete-exam-dialog";
import { CloseExamDialog } from "@/components/exam/close-exam-dialog";
import { getExamState } from "@/lib/exam-state";
import { Exam } from "@/app/generated/prisma/client";

import { useRouter } from "next/navigation";

export function ExamActionsMenu({
  exam,
  roomId,
}: {
  exam: Exam;
  roomId: string;
}) {
  const router = useRouter();
  const computedState = getExamState(exam);

  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto">
          <DropdownMenuItem
            onSelect={() =>
              router.push(`/rooms/${roomId}/exams/${exam.id}/settings`)
            }
          >
            <Settings />
            <span>Exam Settings</span>
          </DropdownMenuItem>
          {(computedState === "ACTIVE" ||
            computedState === "PUBLISHED" ||
            computedState === "SCHEDULED") && (
            <CloseExamDialog
              examId={exam.id}
              examTitle={exam.title}
              trigger={
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <XCircle />
                  <span>Close Exam</span>
                </DropdownMenuItem>
              }
            />
          )}
          <DeleteExamDialog
            roomId={roomId}
            examId={exam.id}
            examTitle={exam.title}
            redirectOnSuccess={true}
            trigger={
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <Trash2 />
                <span>Delete Exam</span>
              </DropdownMenuItem>
            }
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

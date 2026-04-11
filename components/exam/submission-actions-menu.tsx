"use client";

import Link from "next/link";
import { MoreHorizontal, FileText, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteSubmissionDialog } from "@/components/exam/delete-submission-dialog";

interface SubmissionActionsMenuProps {
  roomId: string;
  examId: string;
  submissionId: string;
  examineeName: string;
  status: string;
}

export function SubmissionActionsMenu({
  roomId,
  examId,
  submissionId,
  examineeName,
  status,
}: SubmissionActionsMenuProps) {
  return (
    <div className="flex items-center justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto">
          <DropdownMenuItem asChild disabled={status === "IN_PROGRESS"}>
            <Link
              href={`/rooms/${roomId}/exams/${examId}/submissions/${submissionId}`}
              className="cursor-pointer"
            >
              <FileText />
              Review & Grade
            </Link>
          </DropdownMenuItem>
          <DeleteSubmissionDialog
            submissionId={submissionId}
            examineeName={examineeName}
            trigger={
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
              >
                <Trash2 />
                Delete
              </DropdownMenuItem>
            }
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

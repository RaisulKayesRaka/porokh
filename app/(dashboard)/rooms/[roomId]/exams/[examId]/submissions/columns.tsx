"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, User, EyeOff } from "lucide-react";
import { format } from "date-fns";
import { SubmissionActionsMenu } from "@/components/exam/submission-actions-menu";
import { PublishSubmissionToggle } from "@/components/exam/publish-submission-toggle";

export type SubmissionTableRow = {
  id: string;
  examineeName: string;
  examineeEmail: string;
  examStatus: "IN_PROGRESS" | "SUBMITTED";
  reviewStatus: {
    text: string;
    variant:
      | "default"
      | "secondary"
      | "destructive"
      | "outline"
      | null
      | undefined;
    className: string;
  } | null;
  progress: {
    answered: number;
    total: number;
    percentage: number;
  };
  score: {
    earned: number | null;
    total: number;
  };
  startedAt: Date;
  submittedAt: Date | null;
  durationUsed: string | null;
  roomId: string;
  examId: string;
  rawStatus: string;
  tabSwitchCount: number;
  isResultPublished: boolean;
};

export const columns: ColumnDef<SubmissionTableRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "examineeName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Examinee
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue("examineeName") as string;
      const email = row.original.examineeEmail;

      return (
        <div className="flex items-center gap-3 font-medium">
          <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold">
            <User className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span>{name}</span>
            <span className="text-muted-foreground text-xs font-normal">
              {email}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "examStatus",
    header: "Exam Status",
    cell: ({ row }) => {
      const status = row.getValue("examStatus") as string;
      return (
        <Badge
          variant={status === "IN_PROGRESS" ? "secondary" : "default"}
          className={
            status === "IN_PROGRESS"
              ? "border border-blue-500/20 bg-blue-500/10 text-blue-600"
              : ""
          }
        >
          {status === "IN_PROGRESS" ? "IN PROGRESS" : "SUBMITTED"}
        </Badge>
      );
    },
  },
  {
    id: "reviewStatus",
    header: "Review Status",
    cell: ({ row }) => {
      const rs = row.original.reviewStatus;
      if (!rs) {
        return <span className="text-muted-foreground text-sm">-</span>;
      }
      return (
        <Badge variant={rs.variant as "default" | "secondary" | "destructive" | "outline"} className={rs.className}>
          {rs.text}
        </Badge>
      );
    },
  },
  {
    id: "progress",
    header: "Progress",
    cell: ({ row }) => {
      const p = row.original.progress;
      return (
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold">
            {p.answered} / {p.total}
          </span>
          <div className="bg-muted h-1.5 w-16 overflow-hidden rounded-full">
            <div
              className="bg-primary h-full"
              style={{ width: `${p.percentage}%` }}
            />
          </div>
        </div>
      );
    },
  },
  {
    id: "score",
    accessorFn: (row) => row.score.earned ?? -1,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4"
        >
          Score
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const s = row.original.score;
      if (s.earned !== null) {
        return (
          <span className="font-bold">
            {s.earned}{" "}
            <span className="text-muted-foreground text-xs font-normal">
              / {s.total}
            </span>
          </span>
        );
      }
      return <span className="text-muted-foreground">-</span>;
    },
  },
  {
    accessorKey: "startedAt",
    header: "Started",
    cell: ({ row }) => {
      const date = row.getValue("startedAt") as Date;
      return (
        <span className="text-muted-foreground text-sm">
          {format(new Date(date), "MMM d, h:mm a")}
        </span>
      );
    },
  },
  {
    accessorKey: "submittedAt",
    header: "Submitted",
    cell: ({ row }) => {
      const date = row.getValue("submittedAt") as Date | null;
      if (!date)
        return <span className="text-muted-foreground text-sm">-</span>;
      return (
        <span className="text-muted-foreground text-sm">
          {format(new Date(date), "MMM d, h:mm a")}
        </span>
      );
    },
  },
  {
    accessorKey: "durationUsed",
    header: "Duration",
    cell: ({ row }) => {
      const dur = row.getValue("durationUsed") as string | null;
      if (!dur) return <span className="text-muted-foreground text-sm">-</span>;
      return (
        <span className="text-muted-foreground text-sm font-medium">{dur}</span>
      );
    },
  },
  {
    accessorKey: "tabSwitchCount",
    header: "Tab Switches",
    cell: ({ row }) => {
      const count = row.getValue("tabSwitchCount") as number;
      if (count === 0) {
        return <span className="text-muted-foreground text-sm">0</span>;
      }
      return (
        <div className="flex items-center gap-1.5 text-sm font-medium text-red-600 dark:text-red-400">
          <EyeOff className="h-3.5 w-3.5" />
          {count}
        </div>
      );
    },
  },
  {
    accessorKey: "isResultPublished",
    header: "Published",
    cell: ({ row }) => {
      const isPublished = row.getValue("isResultPublished") as boolean;
      return (
        <PublishSubmissionToggle
          submissionId={row.original.id}
          isPublished={isPublished}
        />
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const original = row.original;
      return (
        <SubmissionActionsMenu
          roomId={original.roomId}
          examId={original.examId}
          submissionId={original.id}
          examineeName={original.examineeName}
          status={original.rawStatus}
        />
      );
    },
  },
];

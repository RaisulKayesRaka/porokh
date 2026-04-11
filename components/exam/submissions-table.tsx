"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns, type SubmissionTableRow } from "@/app/(dashboard)/rooms/[roomId]/exams/[examId]/submissions/columns";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import {
  bulkDeleteSubmissions,
  bulkPublishSubmissions,
} from "@/app/actions/submission";
import { Table } from "@tanstack/react-table";
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

interface SubmissionsTableProps {
  data: SubmissionTableRow[];
}

export function SubmissionsTable({ data }: SubmissionsTableProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleBulkPublish = async (
    table: Table<SubmissionTableRow>,
    publish: boolean
  ) => {
    setIsPublishing(true);
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const submissionIds = selectedRows.map((row) => row.original.id);

    const res = await bulkPublishSubmissions(submissionIds, publish);
    
    if (res.error) {
      toast.error(res.error.message);
    } else {
      toast.success(
        `Successfully ${publish ? "published" : "unpublished"} ${submissionIds.length} results.`
      );
      table.resetRowSelection();
    }
    setIsPublishing(false);
  };

  const handleBulkDelete = async (table: Table<SubmissionTableRow>) => {
    setIsDeleting(true);
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const submissionIds = selectedRows.map((row) => row.original.id);

    const res = await bulkDeleteSubmissions(submissionIds);
    if (res.error) {
      toast.error(res.error.message);
    } else {
      toast.success(`Successfully deleted ${submissionIds.length} submissions.`);
      table.resetRowSelection();
    }
    setIsDeleting(false);
  };

  const renderActions = (table: Table<SubmissionTableRow>) => {
    const selectedCount = table.getFilteredSelectedRowModel().rows.length;
    if (selectedCount === 0) return null;

    return (
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-green-600 dark:text-green-400 border-green-200 hover:bg-green-50 dark:hover:bg-green-600/10"
          disabled={isPublishing || isDeleting}
          onClick={() => handleBulkPublish(table, true)}
        >
          <CheckCircle />
          Publish ({selectedCount})
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-amber-600 dark:text-amber-400 border-amber-200 hover:bg-amber-50 dark:hover:bg-amber-600/10"
          disabled={isPublishing || isDeleting}
          onClick={() => handleBulkPublish(table, false)}
        >
          <XCircle />
          Unpublish ({selectedCount})
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 dark:text-red-400 border-red-200 hover:bg-red-50 dark:hover:bg-red-600/10"
              disabled={isPublishing || isDeleting}
            >
              <Trash2 />
              Delete ({selectedCount})
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete {selectedCount} submissions and their associated answers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => handleBulkDelete(table)}
              >
                Delete {selectedCount} Submissions
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  };

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="examineeName"
      searchPlaceholder="Filter examinees..."
      renderActions={renderActions}
    />
  );
}

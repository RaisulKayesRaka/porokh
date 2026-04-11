import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, EyeOff } from "lucide-react";
import { GradeSubmission } from "@/components/exam/grade-submission";

import { Button } from "@/components/ui/button";

export default async function SubmissionReviewPage({
  params,
}: {
  params: Promise<{ roomId: string; examId: string; submissionId: string }>;
}) {
  const { roomId, examId, submissionId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const membership = await prisma.roomMember.findUnique({
    where: {
      roomId_userId: {
        roomId,
        userId: session.user.id,
      },
    },
  });

  if (!membership || membership.role !== "EXAMINER") {
    redirect(`/rooms/${roomId}/exams/${examId}`);
  }

  const submission = await prisma.examSubmission.findUnique({
    where: { id: submissionId, examId },
    include: {
      examinee: true,
      answers: true,
      exam: {
        include: {
          questions: true,
        },
      },
    },
  });

  if (!submission) {
    redirect(`/rooms/${roomId}/exams/${examId}/submissions`);
  }

  // Get all submissions to determine prev/next navigation
  const allSubmissions = await prisma.examSubmission.findMany({
    where: { examId },
    select: { id: true },
    orderBy: { submittedAt: "desc" },
  });

  const currentIndex = allSubmissions.findIndex((s) => s.id === submissionId);
  const prevId = currentIndex > 0 ? allSubmissions[currentIndex - 1].id : null;
  const nextId =
    currentIndex !== -1 && currentIndex < allSubmissions.length - 1
      ? allSubmissions[currentIndex + 1].id
      : null;

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/rooms/${roomId}/exams/${examId}/submissions`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Grade Submission
          </h2>
          <p className="text-muted-foreground text-sm">
            Review and score examinee answers.
          </p>
        </div>
      </div>

      {submission.tabSwitchCount > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400">
          <EyeOff className="h-4 w-4 shrink-0" />
          This examinee switched tabs{" "}
          <strong>{submission.tabSwitchCount} time{submission.tabSwitchCount !== 1 ? "s" : ""}</strong>{" "}
          during the exam.
        </div>
      )}

      <GradeSubmission 
        submission={submission} 
        prevId={prevId} 
        nextId={nextId} 
        roomId={roomId} 
        examId={examId} 
      />
    </div>
  );
}

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ChevronLeft, User, Download } from "lucide-react";
import { PublishResultsToggle } from "@/components/exam/publish-results-toggle";
import { autoCollectExpiredSubmissions } from "@/app/actions/submission";
import { SubmissionsTable } from "@/components/exam/submissions-table";
import { type SubmissionTableRow } from "./columns";
import { RefreshButton } from "@/components/ui/refresh-button";

export default async function ExamSubmissionsPage({
  params,
}: {
  params: Promise<{ roomId: string; examId: string }>;
}) {
  const { roomId, examId } = await params;

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

  // Auto-collect any expired attempts before rendering the dashboard
  await autoCollectExpiredSubmissions(examId);

  const exam = await prisma.exam.findUnique({
    where: { id: examId, roomId },
    include: {
      submissions: {
        include: {
          examinee: true,
          answers: {
            select: {
              questionId: true,
              score: true,
              textValue: true,
              optionValue: true,
            },
          },
        },
        orderBy: { submittedAt: "desc" },
      },
      _count: { select: { questions: true } },
    },
  });

  if (!exam) {
    redirect(`/rooms/${roomId}/exams`);
  }

  // Calculate total possible points
  const questions = await prisma.question.findMany({
    where: { examId },
    select: { id: true, points: true, type: true },
  });

  const totalPossiblePoints = questions.reduce((sum, q) => sum + q.points, 0);
  const descriptiveQuestionIds = new Set(
    questions.filter((q) => q.type === "DESCRIPTIVE").map((q) => q.id),
  );
  const totalDescriptiveQuestions = descriptiveQuestionIds.size;

  const data: SubmissionTableRow[] = exam.submissions.map((sub) => {
    let reviewStatusText = sub.status.replace("_", " ");
    let reviewStatusVariant:
      | "default"
      | "secondary"
      | "destructive"
      | "outline"
      | null
      | undefined = "secondary";
    let reviewStatusClass = "";

    let reviewStatusObj: SubmissionTableRow["reviewStatus"] = null;

    if (sub.status === "GRADED") {
      reviewStatusText = "REVIEWED";
      reviewStatusVariant = "default";
    } else if (sub.status === "SUBMITTED") {
      if (totalDescriptiveQuestions === 0) {
        reviewStatusText = "NEEDS REVIEW";
        reviewStatusClass =
          "border border-amber-500/20 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20";
      } else {
        const gradedDescriptive = sub.answers.filter(
          (a) => descriptiveQuestionIds.has(a.questionId) && a.score !== null,
        ).length;
        if (gradedDescriptive === 0) {
          reviewStatusText = "NEEDS REVIEW";
          reviewStatusClass =
            "border border-amber-500/20 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20";
        } else if (gradedDescriptive < totalDescriptiveQuestions) {
          reviewStatusText = "IN REVIEW";
          reviewStatusClass =
            "border border-blue-500/20 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20";
        } else {
          reviewStatusText = "FULLY GRADED";
          reviewStatusClass =
            "border border-green-500/20 bg-green-500/10 text-green-700 hover:bg-green-500/20";
        }
      }
    }

    if (sub.status !== "IN_PROGRESS") {
      reviewStatusObj = {
        text: reviewStatusText,
        variant: reviewStatusVariant,
        className: reviewStatusClass,
      };
    }

    let durationUsed: string | null = null;
    if (sub.startedAt && sub.submittedAt) {
      const diffMs = sub.submittedAt.getTime() - sub.startedAt.getTime();
      const minutes = Math.floor(diffMs / 60000);
      const seconds = Math.floor((diffMs % 60000) / 1000);
      durationUsed = `${minutes}m ${seconds}s`;
    } else if (sub.startedAt && sub.status === "IN_PROGRESS") {
      const diffMs = new Date().getTime() - sub.startedAt.getTime();
      const minutes = Math.floor(diffMs / 60000);
      durationUsed = `${minutes}m+ (Ongoing)`;
    }

    const validAnswerCount = sub.answers.filter(
      (a) => (a.textValue && a.textValue.trim() !== "") || a.optionValue
    ).length;

    return {
      id: sub.id,
      examineeName: sub.examinee.name,
      examineeEmail: sub.examinee.email,
      examStatus: sub.status === "IN_PROGRESS" ? "IN_PROGRESS" : "SUBMITTED",
      reviewStatus: reviewStatusObj,
      progress: {
        answered: validAnswerCount,
        total: exam._count.questions,
        percentage:
          (validAnswerCount / Math.max(exam._count.questions, 1)) * 100,
      },
      score: {
        earned: sub.score,
        total: totalPossiblePoints,
      },
      startedAt: sub.startedAt,
      submittedAt: sub.submittedAt,
      durationUsed: durationUsed,
      roomId: roomId,
      examId: examId,
      rawStatus: sub.status,
      tabSwitchCount: sub.tabSwitchCount,
      isResultPublished: sub.isResultPublished,
    };
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/rooms/${roomId}/exams/${examId}`}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Submissions: {exam.title}
            </h2>
            <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" /> {exam.submissions.length} Total
                Submissions
              </span>
              <span className="border-border flex items-center gap-1 border-l pl-4">
                <strong>{totalPossiblePoints}</strong> Max Points
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <RefreshButton variant="outline" size="sm" />
          <Button variant="outline" size="sm" asChild>
            <Link href={`/rooms/${roomId}/exams/${exam.id}/analytics`}>
              Analytics
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={`/api/exams/${exam.id}/export`} download>
              <Download />
              <span className="hidden sm:inline">Export</span> CSV
            </a>
          </Button>
          <PublishResultsToggle
            examId={exam.id}
            initialPublished={exam.resultsPublished}
          />
        </div>
      </div>

      <div className="bg-card text-card-foreground rounded-xl border p-4 shadow">
        <SubmissionsTable data={data} />
      </div>
    </div>
  );
}

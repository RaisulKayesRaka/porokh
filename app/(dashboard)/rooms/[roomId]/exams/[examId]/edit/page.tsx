import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { QuestionBuilder } from "@/components/exam/question-builder";
import { ChevronLeft, Info, CalendarClock, Target } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getExamState } from "@/lib/exam-state";
import { Countdown } from "@/components/ui/countdown";

export default async function EditExamPage({
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
    redirect(`/rooms/${roomId}/exams`);
  }

  const exam = await prisma.exam.findUnique({
    where: { id: examId, roomId },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
      allowedExaminees: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!exam) {
    redirect(`/rooms/${roomId}/exams`);
  }

  const computedState = getExamState(exam);
  const totalMarks = exam.questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/rooms/${roomId}/exams/${examId}`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Question Builder: {exam.title}</h2>
            <Badge
              variant={
                computedState === "PUBLISHED"
                  ? "outline"
                  : computedState === "SCHEDULED"
                    ? "secondary"
                    : computedState === "ACTIVE"
                      ? "default"
                      : computedState === "CLOSED"
                        ? "destructive"
                        : "secondary"
              }
            >
              {computedState}
            </Badge>
          </div>
          <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="flex items-center gap-1">
              <Info className="h-4 w-4" /> {exam.questions.length} Questions
            </span>
            <span className="flex items-center gap-1">
              <Target className="h-4 w-4" /> {totalMarks} Total Marks
            </span>
            {exam.timeLimitMinutes && (
              <span className="flex items-center gap-1">
                <CalendarClock className="h-4 w-4" /> {exam.timeLimitMinutes}m
                limit
              </span>
            )}
            {computedState === "SCHEDULED" && exam.startTime && (
              <Countdown
                targetDate={exam.startTime}
                prefix="Opens in"
                iconClassName="h-4 w-4"
                className="flex items-center gap-1"
              />
            )}
          </div>
        </div>
      </div>

      <div>
        <QuestionBuilder
          examId={exam.id}
          initialQuestions={exam.questions}
          computedState={computedState}
        />
      </div>
    </div>
  );
}

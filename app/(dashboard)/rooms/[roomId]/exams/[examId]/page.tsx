import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Info,
  CalendarClock,
  PlayCircle,
  ShieldCheck,
  Target,
  Eye,
  EyeOff,
  Globe,
  Lock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  startExam,
  autoCollectExpiredSubmissions,
} from "@/app/actions/submission";
import { format } from "date-fns";
import { getExamState } from "@/lib/exam-state";
import { Countdown } from "@/components/ui/countdown";
import { ExamActionsMenu } from "@/components/exam/exam-actions-menu";

export default async function ExamOverviewPage({
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

  if (!membership) {
    redirect(`/rooms`);
  }

  const isExaminer = membership.role === "EXAMINER";

  // Check and process any expired submissions right before fetch
  await autoCollectExpiredSubmissions(examId);

  const exam = await prisma.exam.findUnique({
    where: { id: examId, roomId },
    include: {
      _count: { select: { questions: true, allowedExaminees: true } },
      questions: { select: { points: true } },
      submissions: {
        where: { examineeId: session.user.id },
      },
      allowedExaminees: {
        where: { id: session.user.id },
        select: { id: true },
      },
    },
  });

  if (!exam) {
    redirect(`/rooms/${roomId}/exams`);
  }

  if (!isExaminer) {
    if (exam.status === "DRAFT") {
      redirect(`/rooms/${roomId}/exams`); // Examinees can't view unpublished exams
    }
    if (exam.isRestricted && exam.allowedExaminees.length === 0) {
      redirect(`/rooms/${roomId}/exams`); // Not authorized
    }
  }

  const submission = exam.submissions[0];

  const totalMarks = exam.questions.reduce((sum, q) => sum + q.points, 0);

  const now = new Date();
  const isTooEarly = exam.startTime ? now < exam.startTime : false;
  const isTooLate = exam.endTime ? now > exam.endTime : false;

  const computedState = getExamState(exam);
  const stateVariantMap: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    DRAFT: "secondary",
    PUBLISHED: "outline",
    SCHEDULED: "secondary",
    ACTIVE: "default",
    CLOSED: "destructive",
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/rooms/${roomId}/exams`}>
            <ChevronLeft />
          </Link>
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">Exam Details</h2>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="mb-2 text-2xl">{exam.title}</CardTitle>
              <CardDescription className="text-base">
                {exam.description || "No description provided by the examiner."}
              </CardDescription>
            </div>
            {isExaminer && (
              <div className="flex items-center gap-2">
                <Badge variant={stateVariantMap[computedState]}>
                  {computedState}
                </Badge>
                <ExamActionsMenu exam={exam} roomId={roomId} />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 grid grid-cols-2 gap-4 rounded-lg p-4 md:grid-cols-4">
            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium">
                <Info className="h-4 w-4" /> Questions
              </p>
              <p className="font-semibold">{exam._count.questions}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium">
                <Target className="h-4 w-4" /> Total Marks
              </p>
              <p className="font-semibold">{totalMarks}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium">
                <CalendarClock className="h-4 w-4" /> Time Limit
              </p>
              <p className="font-semibold">
                {exam.timeLimitMinutes
                  ? `${exam.timeLimitMinutes} minutes`
                  : "None"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium">
                {exam.isRestricted ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />} Access
              </p>
              <p className="font-semibold">
                {exam.isRestricted ? `Restricted (${exam._count.allowedExaminees} users)` : "Public"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium">
                {exam.resultsPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />} Results
              </p>
              <p className="font-semibold">
                {exam.resultsPublished ? "Published" : "Hidden"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium">
                Start Time
              </p>
              <p className="font-semibold text-sm">
                {exam.startTime
                  ? format(new Date(exam.startTime), "PPp")
                  : "Not set"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium">
                End Time
              </p>
              <p className="font-semibold text-sm">
                {exam.endTime
                  ? format(new Date(exam.endTime), "PPp")
                  : "Not set"}
              </p>
            </div>
          </div>

          {!isExaminer && (
            <div className="bg-primary/5 border-primary/20 rounded-lg border p-4">
              <h4 className="text-primary mb-2 flex items-center gap-2 font-semibold">
                <ShieldCheck className="h-5 w-5" /> Important Instructions
              </h4>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                <li>
                  Ensure you have a stable internet connection before starting.
                </li>
                {exam.timeLimitMinutes && (
                  <li>
                    Once you start, the timer will not pause if you close the
                    window.
                  </li>
                )}
                <li>
                  Answers are autosaved, but you must click &quot;Submit&quot; to
                  finalize.
                </li>
                <li>You cannot retake the exam once submitted.</li>
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-muted/20 flex flex-col items-start gap-4 border-t p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {!isExaminer && submission && (
              <p className="text-sm font-medium">
                Status:{" "}
                <Badge variant="outline" className="ml-2">
                  {submission.status === "GRADED" && !submission.isResultPublished
                    ? "UNDER REVIEW"
                    : submission.status.replace("_", " ")}
                </Badge>
              </p>
            )}
            {submission &&
              submission.status === "GRADED" &&
              submission.isResultPublished && (
                <p className="mt-2 text-sm font-medium">
                  Score:{" "}
                  <span className="ml-1 font-bold text-green-600 dark:text-green-400">
                    {submission.score} pts
                  </span>
                </p>
              )}
          </div>

          <div className="flex w-full gap-3 sm:w-auto">
            {isExaminer ? (
              <>
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none"
                  asChild
                >
                  <Link href={`/rooms/${roomId}/exams/${exam.id}/edit`}>
                    Question Builder
                  </Link>
                </Button>
                <Button className="flex-1 sm:flex-none" asChild>
                  <Link href={`/rooms/${roomId}/exams/${exam.id}/submissions`}>
                    Submissions & Grading
                  </Link>
                </Button>
              </>
            ) : (
              <>
                {!submission || submission.status === "IN_PROGRESS" ? (
                  <form
                    action={async () => {
                      "use server";
                      const res = await startExam(exam.id);
                      if (!res.error) {
                        redirect(`/rooms/${roomId}/exams/${exam.id}/attempt`);
                      }
                    }}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      size="lg"
                      className="w-full sm:w-auto"
                      type="submit"
                      disabled={!submission && (isTooEarly || isTooLate)}
                    >
                      <PlayCircle className="mr-2 h-5 w-5" />
                      {submission
                        ? "Resume Exam"
                        : isTooEarly
                          ? "Not Started Yet"
                          : isTooLate
                            ? "Exam Ended"
                            : "Start Exam"}
                    </Button>
                  </form>
                ) : (
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full sm:w-auto"
                    disabled
                  >
                    Exam {submission.status.replace("_", " ")}
                  </Button>
                )}
              </>
            )}
          </div>
        </CardFooter>
      </Card>

      {computedState === "SCHEDULED" && exam.startTime && (
        <div className="mt-4 flex justify-center">
          <Countdown
            targetDate={exam.startTime}
            prefix="Exam opens in"
            className="text-secondary-foreground bg-secondary/10 rounded-full px-4 py-2 text-sm font-medium"
          />
        </div>
      )}

      {computedState === "ACTIVE" && exam.endTime && (
        <div className="mt-4 flex justify-center">
          <Countdown
            targetDate={exam.endTime}
            prefix="Exam closes in"
            className="text-destructive bg-destructive/10 rounded-full px-4 py-2 text-sm font-medium"
          />
        </div>
      )}
    </div>
  );
}

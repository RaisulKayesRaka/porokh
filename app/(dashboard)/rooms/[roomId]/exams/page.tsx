import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  PlusCircle,
  FileText,
  Clock,
  PlayCircle,
  Target,
  CalendarDays,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { format, formatDistanceToNow } from "date-fns";
import { getExamState } from "@/lib/exam-state";
import { Countdown } from "@/components/ui/countdown";

export default async function RoomExamsPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;

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
    include: {
      room: true,
    },
  });

  if (!membership) {
    redirect("/rooms");
  }

  const isExaminer = membership.role === "EXAMINER";

  // Fetch exams based on role. Examinees only see published or completed.
  const exams = await prisma.exam.findMany({
    where: {
      roomId,
      status: isExaminer ? undefined : { not: "DRAFT" },
      ...(isExaminer
        ? {}
        : {
            OR: [
              { isRestricted: false },
              { allowedExaminees: { some: { id: session.user.id } } },
            ],
          }),
    },
    include: {
      _count: {
        select: { submissions: true },
      },
      questions: {
        select: { points: true, id: true },
      },
      submissions: {
        where: { examineeId: session.user.id },
        take: 1, // Only need the most recent status
        orderBy: { startedAt: "desc" },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Exams</h2>
          <p className="text-muted-foreground">
            {isExaminer
              ? "Manage exams and assignments for this room."
              : "View and take active exams for this room."}
          </p>
        </div>
        {isExaminer && (
          <Button asChild>
            <Link href={`/rooms/${roomId}/exams/new`}>
              <PlusCircle />
              Create Exam
            </Link>
          </Button>
        )}
      </div>

      {exams.length === 0 ? (
        <Empty className="flex flex-col items-center justify-center py-20 text-center">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="mb-4">
              <FileText className="h-12 w-12" />
            </EmptyMedia>
            <EmptyTitle>No Exams Yet</EmptyTitle>
            <EmptyDescription>
              {isExaminer
                ? "You haven't created any exams for this room yet."
                : "Your examiners haven't published any exams yet."}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="mt-4">
            {isExaminer && (
              <Button asChild>
                <Link href={`/rooms/${roomId}/exams/new`}>
                  <PlusCircle /> Create First Exam
                </Link>
              </Button>
            )}
          </EmptyContent>
        </Empty>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => {
            const hasSubmission = exam.submissions.length > 0;
            const submissionStatus = hasSubmission
              ? exam.submissions[0].status
              : null;
            const computedState = getExamState(exam);

            const totalMarks = exam.questions.reduce(
              (sum, q) => sum + q.points,
              0,
            );

            const startStr = exam.startTime
              ? format(new Date(exam.startTime), "MMM d, yyyy h:mm a")
              : null;
            const endStr = exam.endTime
              ? format(new Date(exam.endTime), "MMM d, yyyy h:mm a")
              : null;
            let timeWindowText = "Available Anytime";
            if (startStr && endStr) {
              timeWindowText = `${format(new Date(exam.startTime!), "MMM d, h:mm a")} - ${format(new Date(exam.endTime!), "MMM d, h:mm a")}`;
            } else if (startStr) {
              timeWindowText = `Starts: ${startStr}`;
            } else if (endStr) {
              timeWindowText = `Ends: ${endStr}`;
            }

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
              <Card key={exam.id} className="flex flex-col">
                <CardHeader className="flex-1 pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="line-clamp-2 text-xl hover:underline">
                      <Link href={`/rooms/${roomId}/exams/${exam.id}`}>
                        {exam.title}
                      </Link>
                    </CardTitle>
                    <Badge
                      variant={stateVariantMap[computedState]}
                      className="shrink-0 whitespace-nowrap"
                    >
                      {computedState}
                    </Badge>
                  </div>
                  <CardDescription className="mt-2 line-clamp-2">
                    {exam.description || "No description provided."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2.5 pb-4 text-sm">
                  <div className="text-muted-foreground flex items-center gap-2">
                    <Target className="text-primary/70 h-4 w-4 shrink-0" />
                    <span>
                      {exam.questions.length} Questions • {totalMarks} Marks
                    </span>
                  </div>

                  <div className="text-muted-foreground flex items-center gap-2">
                    <CalendarDays className="text-primary/70 h-4 w-4 shrink-0" />
                    <span className="line-clamp-1">{timeWindowText}</span>
                  </div>

                  {computedState === "SCHEDULED" && exam.startTime && (
                    <Countdown
                      targetDate={exam.startTime}
                      prefix="Starts in"
                      className="text-muted-foreground"
                      iconClassName="text-primary/70 h-4 w-4 shrink-0"
                    />
                  )}

                  {computedState === "ACTIVE" && exam.endTime && (
                    <Countdown
                      targetDate={exam.endTime}
                      prefix="Ends in"
                      className="text-muted-foreground"
                      iconClassName="text-primary/70 h-4 w-4 shrink-0"
                    />
                  )}

                  {exam.timeLimitMinutes && (
                    <div className="text-muted-foreground flex items-center gap-2">
                      <Clock className="text-primary/70 h-4 w-4 shrink-0" />
                      <span>{exam.timeLimitMinutes} Minutes Limit</span>
                    </div>
                  )}

                  {isExaminer ? (
                    <div className="text-muted-foreground flex items-center gap-2">
                      <Users className="text-primary/70 h-4 w-4 shrink-0" />
                      <span>{exam._count.submissions} Submissions</span>
                    </div>
                  ) : hasSubmission ? (
                    <div className="mt-2 space-y-1.5">
                      <div className="text-primary bg-primary/5 flex w-fit items-center gap-2 rounded-md p-1.5 px-2 font-medium">
                        <span>
                          Status:{" "}
                          {submissionStatus === "GRADED" &&
                          !exam.submissions[0].isResultPublished
                            ? "UNDER REVIEW"
                            : submissionStatus?.replace("_", " ")}
                        </span>
                      </div>
                      {submissionStatus === "GRADED" &&
                        exam.submissions[0].isResultPublished &&
                        exam.submissions[0].score !== null && (
                          <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                            <span>
                              Score: {exam.submissions[0].score} / {totalMarks}
                            </span>
                          </div>
                        )}
                    </div>
                  ) : null}

                  {isExaminer && (
                    <div className="text-muted-foreground mt-4 pt-2 text-xs">
                      Created{" "}
                      {formatDistanceToNow(new Date(exam.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="mt-auto border-t border-none pt-0 pt-4">
                  {isExaminer ? (
                    <div className="flex w-full gap-2">
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/rooms/${roomId}/exams/${exam.id}`}>
                          Manage Exam
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex w-full gap-2">
                      {submissionStatus === "GRADED" &&
                      exam.submissions[0].isResultPublished ? (
                        <Button className="w-full" asChild>
                          <Link
                            href={`/rooms/${roomId}/exams/${exam.id}/results`}
                          >
                            View Results
                          </Link>
                        </Button>
                      ) : submissionStatus === "SUBMITTED" ||
                        (submissionStatus === "GRADED" &&
                          !exam.submissions[0].isResultPublished) ? (
                        <Button variant="outline" className="w-full" disabled>
                          Under Review
                        </Button>
                      ) : (
                        <Button
                          className="group relative w-full overflow-hidden"
                          asChild
                        >
                          <Link href={`/rooms/${roomId}/exams/${exam.id}`}>
                            <span className="relative z-10 flex items-center">
                              {submissionStatus === "IN_PROGRESS"
                                ? "Resume Exam"
                                : "View Exam"}
                              <PlayCircle />
                            </span>
                          </Link>
                        </Button>
                      )}
                    </div>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

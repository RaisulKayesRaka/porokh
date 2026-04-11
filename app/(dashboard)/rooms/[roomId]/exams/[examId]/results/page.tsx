import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ResultsFilter } from "@/components/exam/results-filter";

import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Lock,
  MessageSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RichTextViewer } from "@/components/ui/rich-text-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Option {
  id: string;
  text?: string;
  imageUrl?: string;
}

export default async function ExamResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ roomId: string; examId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { roomId, examId } = await params;
  const resolvedSearchParams = await searchParams;
  const filter = (resolvedSearchParams.filter as string) || "all";

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  // Check if examinee
  const membership = await prisma.roomMember.findUnique({
    where: {
      roomId_userId: {
        roomId,
        userId: session.user.id,
      },
    },
  });

  if (!membership || membership.role !== "EXAMINEE") {
    redirect(`/rooms/${roomId}`);
  }

  const exam = await prisma.exam.findUnique({
    where: { id: examId, roomId },
  });

  if (!exam) {
    redirect(`/rooms/${roomId}/exams`);
  }

  const submission = await prisma.examSubmission.findUnique({
    where: {
      examId_examineeId: {
        examId,
        examineeId: session.user.id,
      },
    },
    include: {
      answers: true,
      exam: {
        include: {
          questions: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!submission || submission.status !== "GRADED") {
    redirect(`/rooms/${roomId}/exams/${examId}`);
  }

  if (!submission.isResultPublished) {
    return (
      <div className="mx-auto max-w-5xl space-y-8 pt-12 pb-12">
        <div className="mx-auto flex max-w-md flex-col items-center justify-center space-y-4 text-center">
          <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
            <Lock className="text-muted-foreground h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold">Results Not Available Yet</h2>
          <p className="text-muted-foreground">
            The examiner has not yet published the results for this exam. Please
            check back later.
          </p>
          <Button asChild className="mt-4">
            <Link href={`/rooms/${roomId}/exams/${examId}`}>
              Return to Exam Page
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const totalPoints = submission.exam.questions.reduce(
    (sum, q) => sum + q.points,
    0,
  );
  const percentage = Math.round(
    ((submission.score || 0) / Math.max(totalPoints, 1)) * 100,
  );

  const filteredQuestions = submission.exam.questions.filter((question) => {
    if (filter === "all") return true;

    const answer = submission.answers.find((a) => a.questionId === question.id);

    const hasActualAnswer = answer && ((answer.textValue && answer.textValue.trim() !== "") || answer.optionValue);

    if (filter === "unanswered") {
      return !hasActualAnswer;
    }
    if (filter === "correct") {
      return answer && answer.score === question.points;
    }
    if (filter === "incorrect") {
      return answer && answer.score !== null && answer.score !== question.points;
    }

    return true;
  });

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/rooms/${roomId}/exams/${examId}`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex w-full flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
              Results: {exam.title}
            </h2>
            <p className="text-muted-foreground text-sm">
              Review your performance and feedback.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                Score
              </span>
              <span className="text-primary text-2xl leading-none font-bold">
                {submission.score}{" "}
                <span className="text-muted-foreground text-sm font-normal">
                  / {totalPoints}
                </span>
              </span>
            </div>
            <div className="border-primary/20 bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 text-sm font-bold">
              {percentage}%
            </div>
          </div>
        </div>
      </div>

      <div className="text-muted-foreground border-b pb-4 text-sm">
        Submitted{" "}
        {submission.submittedAt
          ? formatDistanceToNow(new Date(submission.submittedAt), {
              addSuffix: true,
            })
          : "Unknown"}
      </div>

      {submission.penalty > 0 && (
        <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-lg border p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <h4 className="font-semibold text-base leading-none">Penalty Applied: -{submission.penalty} Points</h4>
            <p className="text-sm text-destructive/90">
              {submission.penaltyReason || "You received a penalty for violating exam rules."}
            </p>
          </div>
        </div>
      )}

      {submission.overallFeedback && (
        <div className="bg-primary/5 border-primary/20 rounded-lg border p-4 flex items-start gap-3">
          <MessageSquare className="h-5 w-5 mt-0.5 shrink-0 text-primary" />
          <div className="space-y-1 w-full">
            <h4 className="font-semibold text-base leading-none text-primary">Overall Feedback</h4>
            <div className="text-sm text-foreground/90 whitespace-pre-wrap pt-2">
              {submission.overallFeedback}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-semibold tracking-tight">
            Answers & Feedback
          </h3>
          <ResultsFilter currentFilter={filter} />
        </div>

        <div className="flex flex-col gap-6">
          {filteredQuestions.length === 0 ? (
            <div className="text-muted-foreground py-12 text-center bg-muted/20 rounded-lg border-2 border-dashed">
                <AlertCircle className="w-8 h-8 opacity-50 mx-auto mb-3" />
                <p>No questions match your current filter.</p>
                <Button variant="link" asChild className="mt-2">
                    <Link href={`/rooms/${roomId}/exams/${examId}/results`}>Clear Filter</Link>
                </Button>
            </div>
          ) : (
            filteredQuestions.map((question) => {
              const originalIndex = submission.exam.questions.findIndex(q => q.id === question.id);
            const answer = submission.answers.find(
              (a) => a.questionId === question.id,
            );

            return (
              <Card key={question.id}>
                <CardHeader className="bg-muted/10 border-b py-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          Question {originalIndex + 1}
                        </span>
                        <Badge variant="outline">
                          {question.type === "MULTIPLE_CHOICE"
                            ? "MCQ"
                            : "Descriptive"}
                        </Badge>
                      </div>
                      <CardTitle className="font-normal text-base mt-2">
                        <RichTextViewer content={question.text} />
                      </CardTitle>
                    </div>
                    <Badge
                      variant={
                        answer?.isCorrect || answer?.score === question.points
                          ? "default"
                          : answer?.score && answer.score > 0
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {answer?.score ?? 0} / {question.points} pt
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="grid gap-4 pt-4">
                  {!answer || (!(answer.textValue && answer.textValue.trim() !== "") && !answer.optionValue) ? (
                    <div className="text-muted-foreground bg-muted/30 flex items-center gap-2 rounded-md p-3 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      You did not provide an answer.
                    </div>
                  ) : (
                    <>
                      {question.type === "MULTIPLE_CHOICE" ? (
                        <div className="space-y-2">
                          {(question.options as unknown as Option[]).map((opt, i) => {
                            const isSelected = answer.optionValue === opt.id;
                            const isCorrectOption =
                              question.correctOption === opt.id;

                            let bgClass = "bg-muted/30 text-muted-foreground";
                            let Icon = null;

                            if (isSelected && isCorrectOption) {
                              bgClass =
                                "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400 font-medium border";
                              Icon = (
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500 mt-1" />
                              );
                            } else if (isSelected && !isCorrectOption) {
                              bgClass =
                                "bg-destructive/10 border-destructive/30 text-destructive font-medium border";
                              Icon = (
                                <XCircle className="text-destructive h-4 w-4 shrink-0 mt-1" />
                              );
                            } else if (!isSelected && isCorrectOption) {
                              bgClass =
                                "bg-green-500/5 border-green-500/20 text-green-700/70 dark:text-green-400/70 border border-dashed";
                              Icon = (
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500/50 mt-1" />
                              );
                            }

                            return (
                              <div
                                key={opt.id || i}
                                className={`flex items-start gap-2 rounded-md p-3 text-sm ${bgClass}`}
                              >
                                {Icon ? (
                                  Icon
                                ) : (
                                  <div className="border-muted-foreground/30 mr-1 ml-1 mt-1 h-4 w-4 shrink-0 rounded-full border" />
                                )}
                                <div className="flex flex-col gap-2">
                                  {opt.text && <span>{opt.text}</span>}
                                  {opt.imageUrl && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={opt.imageUrl} alt="Option" className="max-h-32 rounded-md border shadow-sm" />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="bg-muted/30 rounded-md border p-4 text-sm whitespace-pre-wrap">
                            {answer.textValue ? (
                              <RichTextViewer content={answer.textValue} />
                            ) : (
                              <span className="text-muted-foreground italic">
                                No text provided.
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      {/* Display Examiner Feedback if it exists */}
                      {answer.feedback && (
                        <div className="mt-2 rounded-md border border-blue-100 bg-blue-50 p-4 dark:border-blue-800/50 dark:bg-blue-900/20">
                          <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-900 dark:text-blue-300">
                            <MessageSquare className="h-4 w-4" />
                            Examiner Feedback
                          </h4>
                          <p className="text-sm whitespace-pre-wrap text-blue-800 dark:text-blue-200/80">
                            {answer.feedback}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            );
          }))}
        </div>
      </div>
    </div>
  );
}

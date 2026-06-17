"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { gradeAnswer, applyPenalty, saveOverallFeedback, togglePublishSubmission } from "@/app/actions/grading";
import { aiGradeDescriptiveAnswer } from "@/app/actions/ai-grading";
import {
  Question,
  Answer,
  ExamSubmission,
  User,
  Exam,
} from "@/app/generated/prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RichTextViewer } from "@/components/ui/rich-text-editor";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Save,
  User as UserIcon,
  Calendar,
  GraduationCap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Clock,
  ArrowLeft,
  Timer,
  CheckSquare,
  EyeOff,
  AlertTriangle,
  Info,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Option {
  id: string;
  text?: string;
  imageUrl?: string;
}

interface RubricResult {
  criterion: string;
  marks: number;
  matched: boolean;
  reasoning: string;
}

interface GradeSubmissionProps {
  submission: ExamSubmission & {
    examinee: User;
    answers: Answer[];
    exam: Exam & {
      questions: Question[];
    };
  };
  prevId: string | null;
  nextId: string | null;
  roomId: string;
  examId: string;
}

export function GradeSubmission({
  submission,
  prevId,
  nextId,
  roomId,
  examId,
}: GradeSubmissionProps) {
  const router = useRouter();
  const [savingAnswerId, setSavingAnswerId] = useState<string | null>(null);
  const [aiGradingAnswerId, setAiGradingAnswerId] = useState<string | null>(
    null,
  );
  const [isBlindGrading, setIsBlindGrading] = useState(true);
  const [expandedRubrics, setExpandedRubrics] = useState<
    Record<string, boolean>
  >({});

  const [penalty, setPenalty] = useState<number>(submission.penalty || 0);
  const [penaltyReason, setPenaltyReason] = useState<string>(submission.penaltyReason || "");
  const [isSavingPenalty, setIsSavingPenalty] = useState(false);

  const [overallFeedback, setOverallFeedback] = useState<string>(submission.overallFeedback || "");
  const [isSavingOverallFeedback, setIsSavingOverallFeedback] = useState(false);

  const [isPublishing, setIsPublishing] = useState(false);

  // Local state to manage scores before saving
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    submission.answers.forEach((a) => {
      initial[a.id] = a.score !== null ? a.score : 0;
    });
    return initial;
  });

  const [feedbacks, setFeedbacks] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    submission.answers.forEach((a) => {
      initial[a.id] = a.feedback || "";
    });
    return initial;
  });

  const handleScoreChange = (
    answerId: string,
    value: string,
    maxPoints: number,
  ) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= maxPoints) {
      setScores((prev) => ({ ...prev, [answerId]: numValue }));
    } else if (value === "") {
      setScores((prev) => ({ ...prev, [answerId]: 0 }));
    }
  };

  const saveScore = async (answerId: string) => {
    setSavingAnswerId(answerId);
    const score = scores[answerId] || 0;
    const feedback = feedbacks[answerId] || null;

    const { error } = await gradeAnswer(submission.id, {
      answerId,
      score,
      feedback,
    });

    setSavingAnswerId(null);

    if (error) {
      toast.error(error.message || "Failed to save score.");
    } else {
      toast.success("Score saved!");
      router.refresh();
    }
  };

  const handleAiGrade = async (answerId: string) => {
    setAiGradingAnswerId(answerId);
    const result = await aiGradeDescriptiveAnswer(answerId);
    setAiGradingAnswerId(null);

    if (result.error) {
      toast.error(result.error.message);
    } else {
      toast.success(`AI grading complete! Suggested score: ${result.aiScore}`);
      // Auto-expand the rubric results
      setExpandedRubrics((prev) => ({ ...prev, [answerId]: true }));
      router.refresh();
    }
  };

  const handleApplyPenalty = async () => {
    setIsSavingPenalty(true);
    const { error } = await applyPenalty(submission.id, {
      penalty,
      penaltyReason: penaltyReason.trim() === "" ? null : penaltyReason,
    });
    setIsSavingPenalty(false);

    if (error) {
      toast.error(error.message || "Failed to apply penalty.");
    } else {
      toast.success("Penalty applied successfully.");
      router.refresh();
    }
  };

  const handleSaveOverallFeedback = async () => {
    setIsSavingOverallFeedback(true);
    const { error } = await saveOverallFeedback(submission.id, {
      overallFeedback: overallFeedback.trim() === "" ? null : overallFeedback,
    });
    setIsSavingOverallFeedback(false);

    if (error) {
      toast.error(error.message || "Failed to save overall feedback.");
    } else {
      toast.success("Overall feedback saved successfully.");
      router.refresh();
    }
  };

  const handleTogglePublish = async () => {
    setIsPublishing(true);
    const { error } = await togglePublishSubmission(submission.id, !submission.isResultPublished);
    setIsPublishing(false);

    if (error) {
      toast.error(error.message || "Failed to toggle result status.");
    } else {
      toast.success(
        `Result ${!submission.isResultPublished ? "published to examinee" : "unpublished"}.`,
      );
      router.refresh();
    }
  };

  const acceptAiScore = (answerId: string, aiScore: number) => {
    setScores((prev) => ({ ...prev, [answerId]: aiScore }));
    toast.info("AI score applied. Click Save to confirm.");
  };

  const toggleRubricExpanded = (answerId: string) => {
    setExpandedRubrics((prev) => ({
      ...prev,
      [answerId]: !prev[answerId],
    }));
  };

  // Helper to ensure questions are ordered
  const sortedQuestions = [...submission.exam.questions].sort(
    (a, b) => a.order - b.order,
  );
  const totalPoints = sortedQuestions.reduce((acc, q) => acc + q.points, 0);

  const descriptiveQuestions = sortedQuestions.filter(
    (q) => q.type === "DESCRIPTIVE",
  );
  const totalDescriptive = descriptiveQuestions.length;
  const gradedDescriptive = submission.answers.filter(
    (a) =>
      descriptiveQuestions.some((q) => q.id === a.questionId) &&
      a.score !== null,
  ).length;

  let reviewStatusText = submission.status.replace("_", " ");
  let reviewStatusVariant:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | null
    | undefined = "secondary";
  let reviewStatusClass = "";

  if (submission.status === "GRADED") {
    reviewStatusText = "REVIEWED";
    reviewStatusVariant = "default";
  } else if (submission.status === "SUBMITTED") {
    if (totalDescriptive === 0) {
      reviewStatusText = "NEEDS REVIEW";
      reviewStatusClass =
        "border border-amber-500/20 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20";
    } else {
      if (gradedDescriptive === 0) {
        reviewStatusText = "NEEDS REVIEW";
        reviewStatusClass =
          "border border-amber-500/20 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20";
      } else if (gradedDescriptive < totalDescriptive) {
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

  // Calculate live running score based on the local input states + auto-graded answers
  const currentRunningScore = Object.values(scores).reduce(
    (acc, curr) => acc + (curr || 0),
    0,
  ) - penalty;

  let durationUsed: string | null = null;
  if (submission.startedAt && submission.submittedAt) {
    const diffMs = new Date(submission.submittedAt).getTime() - new Date(submission.startedAt).getTime();
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    durationUsed = `${minutes}m ${seconds}s`;
  }

  const validAnswerCount = submission.answers.filter(
    (a) => (a.textValue && a.textValue.trim() !== "") || a.optionValue !== null
  ).length;

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
      {/* Left Column: Questions List */}
      <div className="flex flex-col gap-6 lg:col-span-2">
        {sortedQuestions.map((question, index) => {
          const answer = submission.answers.find(
            (a) => a.questionId === question.id,
          );

          const rubric = question.rubric as RubricResult[] | null;
          const aiRubricResult = answer
            ? (answer.aiRubricResult as unknown as RubricResult[] | null)
            : null;
          const aiScore = answer ? answer.aiScore : null;
          const hasRubric = rubric && rubric.length > 0;

          return (
            <Card
              key={question.id}
              className={
                answer?.score === null && question.type === "DESCRIPTIVE"
                  ? "border-amber-500/50 shadow-sm"
                  : ""
              }
            >
              <CardHeader className="bg-muted/20 border-b py-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">
                        Question {index + 1}
                      </span>
                      <Badge variant="outline">
                        {question.type === "MULTIPLE_CHOICE"
                          ? "MCQ"
                          : "Descriptive"}
                      </Badge>
                      <Badge variant="secondary">{question.points} pt</Badge>
                      {hasRubric && (
                        <Badge
                          variant="outline"
                          className="border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400"
                        >
                          <Sparkles className="mr-1 h-3 w-3" />
                          AI Rubric
                        </Badge>
                      )}
                      
                      {answer && ((answer.pastedTextLength !== undefined && answer.pastedTextLength > 0) || (answer.timeSpentSeconds !== undefined && answer.timeSpentSeconds > 0)) && (
                        <div className="ml-auto flex items-center">
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted">
                                <Info className="h-4 w-4" />
                              </Button>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80 grid gap-4">
                              <div className="space-y-2">
                                <h4 className="font-medium leading-none text-sm">Activity Details</h4>
                                <p className="text-sm text-muted-foreground">
                                  Insights about the examinee&apos;s activity for this question.
                                </p>
                              </div>
                              <div className="flex flex-col gap-2">
                                {answer && answer.timeSpentSeconds !== undefined && answer.timeSpentSeconds > 0 && (
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                      Time spent: {Math.floor(answer.timeSpentSeconds / 60)}m {(answer.timeSpentSeconds % 60).toString().padStart(2, '0')}s
                                    </span>
                                  </div>
                                )}
                                {answer && answer.pastedTextLength !== undefined && answer.pastedTextLength > 0 && (
                                  <div className="flex items-center gap-2 text-destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span className="text-sm font-medium">
                                      Pasted {answer.pastedTextLength} chars in {answer.pasteCount} paste{answer.pasteCount !== 1 ? 's' : ''}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </div>
                      )}
                    </div>
                    <CardTitle className="font-normal text-base mt-2">
                       <RichTextViewer content={question.text} />
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="grid gap-4 pt-4">
                {/* Answer Display */}
                {!answer ? (
                  <div className="text-muted-foreground bg-muted/30 flex items-center gap-2 rounded-md p-3 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    No answer provided by the examinee.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {question.type === "MULTIPLE_CHOICE" ? (
                      <>
                        <div className="flex flex-col gap-2">
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
                        <div className="flex items-center justify-end gap-2 border-t pt-4">
                          <span className="text-muted-foreground text-sm">
                            Auto-graded Score:
                          </span>
                          <Badge
                            variant={
                              answer.isCorrect ? "default" : "destructive"
                            }
                          >
                            {answer.score} / {question.points}
                          </Badge>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-muted/30 min-h-[100px] rounded-md border p-4 text-sm whitespace-pre-wrap">
                          {answer.textValue ? (
                            <RichTextViewer content={answer.textValue} />
                          ) : (
                            <span className="text-muted-foreground italic">
                              No text provided.
                            </span>
                          )}
                        </div>

                        {/* Model Answer & Rubric (For Evaluator Reference) */}
                        {(hasRubric || question.correctOption) && (
                          <div className="rounded-lg border bg-card overflow-hidden">
                            <div className="bg-muted/50 px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground border-b flex items-center justify-between">
                              <span>Grading Criteria Reference</span>
                            </div>
                            <div className="p-4 space-y-4 text-sm bg-muted/10">
                              {question.correctOption && (
                                <div className="space-y-1">
                                  <span className="font-semibold text-primary">Model/Sample Answer:</span>
                                  <div className="bg-background rounded border p-3 whitespace-pre-wrap">
                                    {question.correctOption}
                                  </div>
                                </div>
                              )}
                              {hasRubric && rubric && (
                                <div className="space-y-2">
                                  <span className="font-semibold text-primary">Target Criteria:</span>
                                  <div className="space-y-2">
                                    {rubric.map((r, i) => (
                                      <div key={i} className="flex items-start justify-between gap-4 p-2 rounded-md bg-background border">
                                        <div className="flex items-start gap-2">
                                          <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/50 shrink-0" />
                                          <span className="text-muted-foreground font-medium">{r.criterion}</span>
                                        </div>
                                        <Badge variant="secondary" className="shrink-0">{r.marks} pt</Badge>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* AI Rubric Results */}
                        {aiRubricResult && aiRubricResult.length > 0 && (
                          <div className="rounded-lg border border-violet-500/20 bg-violet-50/50 dark:bg-violet-950/20">
                            <button
                              type="button"
                              className="flex w-full items-center justify-between p-3 text-sm font-medium"
                              onClick={() => toggleRubricExpanded(answer.id)}
                            >
                              <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-violet-500" />
                                <span>
                                  AI Rubric Result:{" "}
                                  <span className="font-bold">
                                    {aiScore} / {question.points}
                                  </span>
                                </span>
                              </div>
                              {expandedRubrics[answer.id] ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </button>
                            {expandedRubrics[answer.id] && (
                              <div className="space-y-2 border-t border-violet-500/20 p-3">
                                {aiRubricResult.map(
                                  (result: RubricResult, i: number) => (
                                    <div
                                      key={i}
                                      className={`flex items-start gap-3 rounded-md p-2.5 text-sm ${
                                        result.matched
                                          ? "bg-green-500/10"
                                          : "bg-red-500/5"
                                      }`}
                                    >
                                      {result.matched ? (
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                                      ) : (
                                        <XCircle className="text-destructive mt-0.5 h-4 w-4 shrink-0" />
                                      )}
                                      <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                          <span className="font-medium">
                                            {result.criterion}
                                          </span>
                                          <Badge
                                            variant={
                                              result.matched
                                                ? "default"
                                                : "secondary"
                                            }
                                            className="text-xs"
                                          >
                                            {result.matched
                                              ? `+${result.marks}`
                                              : "0"}{" "}
                                            / {result.marks}
                                          </Badge>
                                        </div>
                                        <p className="text-muted-foreground text-xs">
                                          {result.reasoning}
                                        </p>
                                      </div>
                                    </div>
                                  ),
                                )}
                                <div className="flex justify-end pt-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-violet-500/30 text-violet-600 hover:bg-violet-500/10 dark:text-violet-400"
                                    onClick={() =>
                                      acceptAiScore(
                                        answer.id,
                                        aiScore ?? 0,
                                      )
                                    }
                                  >
                                    <Sparkles className="mr-2 h-3 w-3" />
                                    Accept AI Score ({aiScore})
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    {/* Manual Grading Controls (Applicable to both MCQ and Descriptive) */}
                    <div className="-mx-4 -mb-4 flex flex-col gap-4 rounded-b-lg border-t bg-amber-50/10 p-4 pt-4 dark:bg-amber-950/10">
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium">
                          Examiner Feedback (Optional)
                        </span>
                        <Textarea
                          placeholder="Provide feedback or remarks for the examinee..."
                          value={feedbacks[answer.id]}
                          onChange={(e) =>
                            setFeedbacks((prev) => ({
                              ...prev,
                              [answer.id]: e.target.value,
                            }))
                          }
                          className="bg-background min-h-[80px]"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium">
                            Assign Points:
                          </span>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min={0}
                              max={question.points}
                              step={0.5}
                              value={scores[answer.id]}
                              onChange={(e) =>
                                handleScoreChange(
                                  answer.id,
                                  e.target.value,
                                  question.points,
                                )
                              }
                              className="w-20 text-center font-bold"
                            />
                            <span className="text-muted-foreground text-sm whitespace-nowrap">
                              / {question.points}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-end gap-2">
                          {hasRubric && question.type === "DESCRIPTIVE" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-violet-500/30 text-violet-600 hover:bg-violet-500/10 dark:text-violet-400 w-full sm:w-auto"
                                  onClick={() => handleAiGrade(answer.id)}
                                  disabled={aiGradingAnswerId === answer.id}
                                >
                                  <Sparkles className="mr-2 h-3 w-3" />
                                  {aiGradingAnswerId === answer.id
                                ? "Grading..."
                                : aiRubricResult
                                  ? "Re-grade"
                                  : "AI Grade"}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={() => saveScore(answer.id)}
                            disabled={
                              savingAnswerId === answer.id ||
                              (scores[answer.id] === answer.score &&
                                feedbacks[answer.id] ===
                                  (answer.feedback || ""))
                            }
                          >
                            <Save />
                            {savingAnswerId === answer.id
                              ? "Saving..."
                              : answer.score === null
                                ? "Grade"
                                : "Update"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Right Column: Sticky Dashboard */}
      <div className="bg-card text-card-foreground order-first flex flex-col overflow-hidden rounded-xl border shadow-sm lg:sticky lg:top-20 lg:order-none lg:col-span-1">
        <div className="bg-muted/20 border-b p-4 flex items-center justify-between sm:p-6">
          <h3 className="flex items-center gap-2 font-semibold">
            <GraduationCap className="text-primary h-5 w-5" />
            Summary
          </h3>
          <div className="flex items-center gap-2">
            <Label htmlFor="blind-grading" className="text-xs sr-only lg:not-sr-only">Blind Grading</Label>
            <Switch 
              id="blind-grading" 
              checked={isBlindGrading} 
              onCheckedChange={setIsBlindGrading} 
            />
          </div>
        </div>
        <div className="space-y-6 p-6">
          <div className="space-y-4 border-b pb-6">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                {isBlindGrading ? <EyeOff className="h-5 w-5" /> : <UserIcon className="h-5 w-5" />}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="truncate font-semibold">
                  {isBlindGrading 
                    ? `Examinee #${submission.examineeId.slice(-5).toUpperCase()}` 
                    : submission.examinee.name}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {isBlindGrading 
                    ? "Identity Hidden" 
                    : submission.examinee.email}
                </span>
              </div>
            </div>

            <div className="text-muted-foreground bg-muted/30 flex items-center gap-2 rounded-md p-2.5 text-sm">
              <Calendar className="h-4 w-4 shrink-0" />
              <span className="truncate">
                Submitted{" "}
                {submission.submittedAt
                  ? formatDistanceToNow(new Date(submission.submittedAt), {
                      addSuffix: true,
                    })
                  : "Unknown"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm font-medium">
                Exam Status
              </span>
              <Badge
                variant={
                  submission.status === "IN_PROGRESS" ? "secondary" : "default"
                }
                className={
                  submission.status === "IN_PROGRESS"
                    ? "border border-blue-500/20 bg-blue-500/10 text-blue-600"
                    : ""
                }
              >
                {submission.status === "IN_PROGRESS"
                  ? "IN PROGRESS"
                  : "SUBMITTED"}
              </Badge>
            </div>
            {submission.status !== "IN_PROGRESS" && (
              <>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-muted-foreground text-sm font-medium">
                    Review Status
                  </span>
                  <Badge
                    variant={reviewStatusVariant}
                    className={reviewStatusClass}
                  >
                    {reviewStatusText}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-muted-foreground text-sm font-medium">
                    Examinee Visibility
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-medium">
                      {submission.isResultPublished ? "Published" : "Hidden"}
                    </span>
                    <Switch 
                      disabled={isPublishing} 
                      checked={submission.isResultPublished} 
                      onCheckedChange={handleTogglePublish} 
                    />
                  </div>
                </div>
              </>
            )}
            <div className="flex flex-col gap-2 border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm flex items-center gap-1 font-medium">
                  <CheckSquare className="h-4 w-4" /> Answers
                </span>
                <span className="text-sm font-medium">
                  {validAnswerCount} / {sortedQuestions.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm flex items-center gap-1 font-medium">
                  <Timer className="h-4 w-4" /> Duration
                </span>
                <span className="text-sm font-medium">
                  {durationUsed || "Unknown"}
                </span>
              </div>
              {submission.tabSwitchCount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm flex items-center gap-1 font-medium">
                    <AlertCircle className="h-4 w-4 text-red-500" /> Violations
                  </span>
                  <Badge variant="destructive" className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20">
                    {submission.tabSwitchCount} Tab Switches
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 border-t pt-4">
              <h4 className="text-sm font-semibold text-destructive flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" /> Global Penalty
              </h4>
              <div className="grid grid-cols-[80px_1fr] gap-2 items-start">
                <Input
                  type="number"
                  min={0}
                  step={0.5}
                  value={penalty.toString()}
                  onChange={(e) => setPenalty(parseFloat(e.target.value) || 0)}
                  className="w-full text-center font-bold"
                  placeholder="Pts"
                />
                <Input
                  placeholder="Reason (e.g. Cheating)"
                  value={penaltyReason}
                  onChange={(e) => setPenaltyReason(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                disabled={isSavingPenalty || (penalty === submission.penalty && penaltyReason === (submission.penaltyReason || ""))}
                onClick={handleApplyPenalty}
              >
                {isSavingPenalty ? "Saving..." : "Apply Penalty"}
              </Button>
            </div>

            <div className="mt-2 flex items-center justify-between border-t pt-4">
              <span className="text-muted-foreground text-sm font-medium">
                Running Score
              </span>
              <span className="text-xl font-bold flex items-center gap-2">
                {currentRunningScore}{" "}
                <span className="text-muted-foreground text-sm font-normal">
                  / {totalPoints}
                </span>
                <Badge variant="outline" className="ml-2 font-mono bg-primary/10 text-primary border-primary/20">
                  {((currentRunningScore / Math.max(totalPoints, 1)) * 100).toFixed(0)}%
                </Badge>
              </span>
            </div>

            <div className="flex flex-col gap-2 border-t pt-4">
              <span className="text-sm font-medium flex items-center gap-1">
                Overall Feedback
              </span>
              <Textarea
                placeholder="Leave a final cohesive comment for the examinee here..."
                value={overallFeedback}
                onChange={(e) => setOverallFeedback(e.target.value)}
                className="min-h-[100px] text-sm"
              />
              <Button
                size="sm"
                variant="secondary"
                disabled={isSavingOverallFeedback || overallFeedback === (submission.overallFeedback || "")}
                onClick={handleSaveOverallFeedback}
              >
                {isSavingOverallFeedback ? "Saving..." : "Save Overall Feedback"}
              </Button>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 border-t pt-4">
            <Button
              variant="outline"
              className="flex-1"
              disabled={!prevId}
              onClick={() => {
                if (prevId) {
                  router.push(`/rooms/${roomId}/exams/${examId}/submissions/${prevId}`);
                }
              }}
            >
              <ArrowLeft /> Prev
            </Button>
            <Button
              className="flex-1"
              disabled={!nextId}
              onClick={() => {
                if (nextId) {
                  router.push(`/rooms/${roomId}/exams/${examId}/submissions/${nextId}`);
                }
              }}
            >
              Next <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

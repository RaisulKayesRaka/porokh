"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Question, Answer } from "@/app/generated/prisma/client";
import {
  saveAnswer,
  submitExam,
  reportTabSwitch,
} from "@/app/actions/submission";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  RichTextEditor,
  RichTextViewer,
} from "@/components/ui/rich-text-editor";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  ChevronLeft,
  Save,
  AlertTriangle,
  EyeOff,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { differenceInSeconds } from "date-fns";

type Attachment = { url: string; publicId: string; name: string };
type OptionType = {
  id: string;
  text?: string;
  imageUrl?: string;
  imagePublicId?: string;
};

interface TakeExamClientProps {
  roomId: string;
  examId: string;
  submissionId: string;
  exam: {
    title: string;
    timeLimitMinutes: number | null;
    endTime: Date | null;
  };
  questions: Question[];
  initialAnswers: string; // JSON string to avoid server/client hydration mismatches with Complex types
  startedAt: Date;
}

export function TakeExamClient({
  roomId,
  examId,
  submissionId,
  exam,
  questions,
  initialAnswers,
  startedAt,
}: TakeExamClientProps) {
  const router = useRouter();
  const parsedAnswers = JSON.parse(initialAnswers) as Answer[];

  // Store answers locally
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const acc: Record<string, string> = {};
    parsedAnswers.forEach((ans) => {
      if (ans.optionValue) acc[ans.questionId] = ans.optionValue;
      if (ans.textValue) acc[ans.questionId] = ans.textValue;
    });
    return acc;
  });

  const [attachments] = useState<Record<string, Attachment[]>>(
    () => {
      const acc: Record<string, Attachment[]> = {};
      parsedAnswers.forEach((ans) => {
        if (ans.attachments) {
          try {
            const parsed =
              typeof ans.attachments === "string"
                ? JSON.parse(ans.attachments)
                : ans.attachments;
            if (Array.isArray(parsed)) {
              acc[ans.questionId] = parsed;
            }
          } catch {
            // ignore
          }
        }
      });
      return acc;
    },
  );

  const [questionTime, setQuestionTime] = useState<Record<string, number>>(
    () => {
      const acc: Record<string, number> = {};
      parsedAnswers.forEach((ans) => {
        if (ans.timeSpentSeconds) acc[ans.questionId] = ans.timeSpentSeconds;
      });
      return acc;
    },
  );

  const pasteCountRef = useRef<Record<string, number>>(
    (() => {
      const acc: Record<string, number> = {};
      parsedAnswers.forEach((ans) => {
        if (ans.pasteCount) acc[ans.questionId] = ans.pasteCount;
      });
      return acc;
    })(),
  );

  const pastedTextLengthRef = useRef<Record<string, number>>(
    (() => {
      const acc: Record<string, number> = {};
      parsedAnswers.forEach((ans) => {
        if (ans.pastedTextLength) acc[ans.questionId] = ans.pastedTextLength;
      });
      return acc;
    })(),
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeftStr, setTimeLeftStr] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showTabWarning, setShowTabWarning] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleFinalSubmit = useCallback(
    async (redirectAfter = true) => {
      setIsSubmitting(true);
      setIsConfirmOpen(false);

      const { error } = await submitExam(submissionId);
      setIsSubmitting(false);

      if (error) {
        toast.error(error.message || "Failed to submit exam.");
      } else {
        toast.success("Exam submitted successfully!");
        if (redirectAfter) {
          router.push(`/rooms/${roomId}/exams/${examId}`);
        }
      }
    },
    [submissionId, roomId, examId, router],
  );

  // Calculate exact expiration date prioritizing the earliest constraint
  const getExpirationDate = useCallback(() => {
    let expiresAt: Date | null = null;

    if (exam.timeLimitMinutes) {
      expiresAt = new Date(startedAt.getTime() + exam.timeLimitMinutes * 60000);
    }

    if (exam.endTime) {
      const endTimeDate = new Date(exam.endTime);
      if (!expiresAt || endTimeDate.getTime() < expiresAt.getTime()) {
        expiresAt = endTimeDate;
      }
    }

    return expiresAt;
  }, [exam.timeLimitMinutes, exam.endTime, startedAt]);

  // Track time spent on the active question locally
  useEffect(() => {
    if (!currentQuestion) return;
    const interval = setInterval(() => {
      setQuestionTime((prev) => ({
        ...prev,
        [currentQuestion.id]: (prev[currentQuestion.id] || 0) + 1,
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentQuestion]);

  // Timer logic
  useEffect(() => {
    const expirationDate = getExpirationDate();
    if (!expirationDate) return;

    let hasAutoSubmitted = false;

    const updateTimer = () => {
      if (hasAutoSubmitted) return;

      const remainingSeconds = Math.max(
        differenceInSeconds(expirationDate, new Date()),
        0,
      );

      if (remainingSeconds <= 0) {
        hasAutoSubmitted = true;
        handleFinalSubmit(true);
        toast.info("Time is up! Submitting exam automatically.");
        return;
      }

      const m = Math.floor(remainingSeconds / 60);
      const s = remainingSeconds % 60;

      if (m > 60) {
        const h = Math.floor(m / 60);
        const mRemainder = m % 60;
        setTimeLeftStr(
          `${h}:${mRemainder.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`,
        );
      } else {
        setTimeLeftStr(`${m}:${s.toString().padStart(2, "0")}`);
      }
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [getExpirationDate, handleFinalSubmit]);

  // Tab switch / window blur detection
  useEffect(() => {
    const hasFocusRef = { current: true };

    const handleLeave = () => {
      // Bypass if the user opened the native file picker for image upload
      if (window.sessionStorage.getItem("filePickerOpen") === "true") return;

      if (!hasFocusRef.current) return;
      hasFocusRef.current = false;
      setTabSwitchCount((prev) => prev + 1);
      reportTabSwitch(submissionId);
    };

    const handleReturn = () => {
      // Clear the bypass flag when focus returns
      if (window.sessionStorage.getItem("filePickerOpen") === "true") {
        setTimeout(() => {
          window.sessionStorage.removeItem("filePickerOpen");
        }, 1000); // small delay to ensure native events settle
      }

      if (hasFocusRef.current) return;
      hasFocusRef.current = true;
      setShowTabWarning(true);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        handleLeave();
      } else {
        handleReturn();
      }
    };

    const handleBlur = () => handleLeave();
    const handleFocus = () => handleReturn();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [submissionId]);

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData?.getData("text");
    if (!pastedText) return;

    pasteCountRef.current[currentQuestion.id] =
      (pasteCountRef.current[currentQuestion.id] || 0) + 1;
    pastedTextLengthRef.current[currentQuestion.id] =
      (pastedTextLengthRef.current[currentQuestion.id] || 0) +
      pastedText.length;
  };

  const syncDataToServer = async (
    qId: string,
    valueStr: string | undefined,
    atts: Attachment[] | undefined,
  ) => {
    setIsSaving(true);
    const qObj = questions.find((q) => q.id === qId);
    const data = {
      questionId: qId,
      timeSpentSeconds: questionTime[qId] || 0,
      pasteCount: pasteCountRef.current[qId] || 0,
      pastedTextLength: pastedTextLengthRef.current[qId] || 0,
      optionValue:
        qObj?.type === "MULTIPLE_CHOICE" && valueStr ? valueStr : undefined,
      textValue:
        qObj?.type === "DESCRIPTIVE" && valueStr ? valueStr : undefined,
      attachments: atts,
    };

    const { error } = await saveAnswer(submissionId, data);
    setIsSaving(false);
    if (error) {
      toast.error(error.message || "Autosave failed.");
    }
  };

  const handleAnswerChange = async (val: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: val }));
    syncDataToServer(currentQuestion.id, val, attachments[currentQuestion.id]);
  };

  const handleNext = () => {
    syncDataToServer(
      currentQuestion.id,
      answers[currentQuestion.id],
      attachments[currentQuestion.id],
    );
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((c) => c + 1);
    }
  };

  const handlePrev = () => {
    syncDataToServer(
      currentQuestion.id,
      answers[currentQuestion.id],
      attachments[currentQuestion.id],
    );
    if (currentIndex > 0) {
      setCurrentIndex((c) => c - 1);
    }
  };

  // Determine answered count
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = (answeredCount / questions.length) * 100;

  return (
    <div className="mx-auto max-w-4xl px-2 pb-24 sm:px-0">
      {/* Sticky Header */}
      <div className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-16 z-40 -mx-2 mb-8 border-b px-3 py-4 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold tracking-tight sm:text-xl">
              {exam.title}
            </h2>
            <div className="mt-2 flex items-center gap-4">
              <span className="text-muted-foreground text-sm font-medium">
                Question {currentIndex + 1} of {questions.length}
              </span>
              {isSaving ? (
                <span className="text-muted-foreground flex items-center gap-1 text-xs">
                  <Save className="h-3 w-3 animate-pulse" /> Saving...
                </span>
              ) : (
                <span className="text-muted-foreground flex items-center gap-1 text-xs">
                  <Save className="h-3 w-3" /> Saved
                </span>
              )}
            </div>
          </div>

          {timeLeftStr && (
            <div className="bg-destructive/10 border-destructive/20 text-destructive flex items-center rounded-full border px-4 py-2 font-mono font-bold">
              {timeLeftStr} remaining
            </div>
          )}
        </div>
        {/* Progress Bar */}
        <div className="bg-muted mt-4 h-1 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Tab Switch Warning Banner */}
      {showTabWarning && (
        <div className="bg-destructive/10 border-destructive/30 mb-4 flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-2 text-sm font-medium text-red-700 dark:text-red-400">
            <EyeOff className="h-4 w-4 shrink-0" />
            <span>
              Tab switch detected! You have left the exam tab{" "}
              <strong>
                {tabSwitchCount} time{tabSwitchCount !== 1 ? "s" : ""}
              </strong>
              . This is recorded and visible to the examiner.
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 text-xs"
            onClick={() => setShowTabWarning(false)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Question Area */}
      <Card className="border-primary/20 flex min-h-75 flex-col  sm:min-h-100">
        <CardHeader className="bg-muted/10 border-b">
          <div className="flex items-start justify-between">
            <Badge variant="outline">
              {currentQuestion.type === "MULTIPLE_CHOICE"
                ? "Multiple Choice"
                : "Descriptive"}
            </Badge>
            <span className="text-muted-foreground text-sm font-medium">
              {currentQuestion.points} Points
            </span>
          </div>
          <CardTitle className="mt-4 font-normal">
            <RichTextViewer
              content={currentQuestion.text}
              className="text-xl leading-relaxed"
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-6 sm:p-10">
          {currentQuestion.type === "MULTIPLE_CHOICE" &&
          currentQuestion.options ? (
            <RadioGroup
              value={answers[currentQuestion.id] || ""}
              onValueChange={handleAnswerChange}
              className="space-y-4"
            >
              {(currentQuestion.options as OptionType[]).map((opt) => (
                <div
                  key={opt.id}
                  className={`flex items-start space-x-3 rounded-lg border p-4 transition-colors ${answers[currentQuestion.id] === opt.id ? "bg-primary/5 border-primary " : "hover:bg-muted/50"}`}
                >
                  <RadioGroupItem
                    value={opt.id}
                    id={`opt-${opt.id}`}
                    className="mt-1"
                  />
                  <Label
                    htmlFor={`opt-${opt.id}`}
                    className="flex flex-1 cursor-pointer flex-col gap-2"
                  >
                    {opt.text && (
                      <span className="text-base leading-relaxed">
                        {opt.text}
                      </span>
                    )}
                    {opt.imageUrl && (
                      <div className="mt-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={opt.imageUrl}
                          alt="Option"
                          className="max-h-48 rounded-md border "
                        />
                      </div>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="w-full space-y-6">
              <RichTextEditor
                placeholder="Type your answer here..."
                className="min-h-37.5 resize-y text-base sm:min-h-50"
                value={answers[currentQuestion.id] || ""}
                onChange={(val) => handleAnswerChange(val)}
                onPaste={handlePaste as unknown as (e: ClipboardEvent) => void}
                allowImages={true}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-muted/20 flex items-center justify-between border-t p-4">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            <ChevronLeft /> Previous
          </Button>

          {isLastQuestion ? (
            <Button
              onClick={() => setIsConfirmOpen(true)}
              className="bg-green-600 text-white hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Exam"}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next <ChevronRight />
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Question Navigator Drawer/Grid */}
      <div className="mt-8">
        <h3 className="mb-4 text-sm font-medium">Question Navigator</h3>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, i) => {
            const isAnswered = !!answers[q.id];
            const isCurrent = i === currentIndex;
            return (
              <button
                key={q.id}
                onClick={() => {
                  if (currentIndex !== i) {
                    syncDataToServer(
                      currentQuestion.id,
                      answers[currentQuestion.id],
                      attachments[currentQuestion.id],
                    );
                    setCurrentIndex(i);
                  }
                }}
                className={`flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-all ${isCurrent ? "ring-primary ring-2 ring-offset-2" : ""} ${isAnswered ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"} `}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ready to submit your exam?</AlertDialogTitle>
            <AlertDialogDescription>
              {answeredCount < questions.length ? (
                <div className="mt-2 flex items-center font-medium text-amber-600 dark:text-amber-500">
                  <AlertTriangle className="mr-2" />
                  <span>
                    You have unanswered questions (
                    {questions.length - answeredCount}). Are you absolutely
                    sure?
                  </span>
                </div>
              ) : (
                "You have answered all questions. Once submitted, you cannot change your answers."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleFinalSubmit(true);
              }}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Yes, Submit Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

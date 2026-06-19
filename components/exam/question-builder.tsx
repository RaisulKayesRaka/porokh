"use client";

import { useState, useEffect } from "react";
import {
  ArrowUpDown,
  FileQuestion,
  Edit2,
  Trash2,
  PlusCircle,
  CheckCircle2,
  Info,
} from "lucide-react";
import { MoveQuestionDialog } from "@/components/exam/move-question-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { QuestionInput } from "@/lib/validations/exam";
import {
  publishExam,
  addQuestion,
  deleteQuestion,
  updateQuestion,
  reorderQuestions,
} from "@/app/actions/exam";
import { Question } from "@/app/generated/prisma/client";
import { ComputedExamState } from "@/lib/exam-state";
import { RichTextViewer } from "@/components/ui/rich-text-editor";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuestionForm } from "@/components/exam/question-form";

interface Option {
  id: string;
  text?: string;
  imageUrl?: string;
}

interface QuestionBuilderProps {
  examId: string;
  initialQuestions: Question[];
  computedState: ComputedExamState;
}

export function QuestionBuilder({
  examId,
  initialQuestions,
  computedState,
}: QuestionBuilderProps) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);

  useEffect(() => {
    setQuestions(initialQuestions);
  }, [initialQuestions]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [movingQuestionId, setMovingQuestionId] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isLocked = computedState === "ACTIVE" || computedState === "CLOSED";

  const handleMoveConfirm = async (newPosition: number) => {
    if (!movingQuestionId || isLocked) return;

    // Find the current index based on the ID
    const sourceIndex = questions.findIndex((q) => q.id === movingQuestionId);
    if (sourceIndex === -1) return;

    // Convert 1-based position to 0-based index
    const destinationIndex = newPosition - 1;
    if (sourceIndex === destinationIndex) {
      setMovingQuestionId(null);
      return;
    }

    const newQuestions = Array.from(questions);
    const [moved] = newQuestions.splice(sourceIndex, 1);
    newQuestions.splice(destinationIndex, 0, moved);

    // Update order values
    const updatedQuestions = newQuestions.map((q, index) => ({
      ...q,
      order: index + 1,
    }));

    // Optimistic update
    setQuestions(updatedQuestions);
    setMovingQuestionId(null);

    const updates = updatedQuestions.map((q) => ({ id: q.id, order: q.order }));
    const { error } = await reorderQuestions(examId, updates);

    if (error) {
      toast.error(error.message || "Failed to reorder questions.");
      setQuestions(initialQuestions); // Revert on failure
    } else {
      router.refresh();
      toast.success("Question moved successfully.");
    }
  };

  const handleAddSubmit = async (data: QuestionInput) => {
    const { error } = await addQuestion(examId, data);
    if (error) {
      toast.error(error.message || "Failed to add question.");
    } else {
      toast.success("Question added!");
      setIsAdding(false);
      router.refresh();
    }
  };

  const handleEditSubmit = async (questionId: string, data: QuestionInput) => {
    const { error } = await updateQuestion(questionId, data);
    if (error) {
      toast.error(error.message || "Failed to update question.");
    } else {
      toast.success("Question updated!");
      setEditingId(null);
      router.refresh();
    }
  };

  const handleDelete = async (questionId: string) => {
    setDeletingId(questionId);
    const { error } = await deleteQuestion(questionId);
    if (error) {
      toast.error(error.message || "Failed to delete question.");
    } else {
      toast.success("Question deleted.");
      router.refresh();
    }
    setDeletingId(null);
  };

  const handlePublish = async () => {
    if (initialQuestions.length === 0) {
      toast.error("You must add at least one question before publishing.");
      return;
    }

    setIsPublishing(true);
    const { error } = await publishExam(examId);
    setIsPublishing(false);

    if (error) {
      toast.error(error.message || "Failed to publish exam.");
    } else {
      toast.success("Exam published successfully!");
      router.refresh();
    }
  };

  return (
    <div className="space-y-8">
      {/* Existing Questions List */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="bg-muted/20 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center">
            <FileQuestion className="text-muted-foreground mb-4 h-10 w-10 opacity-50" />
            <p className="text-muted-foreground">No questions added yet.</p>
          </div>
        ) : (
          questions.map((q, index) => {
            if (editingId === q.id) {
              return (
                <Card key={q.id} className="border-primary/50 ">
                  <CardHeader>
                    <CardTitle>Edit Question {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <QuestionForm
                      initialValues={{
                        type: q.type as "MULTIPLE_CHOICE" | "DESCRIPTIVE",
                        text: q.text,
                        points: q.points,
                        options: q.options
                          ? (q.options as unknown as Option[])
                          : Array.from({ length: 4 }).map(() => ({ id: crypto.randomUUID(), text: "" })),
                        correctOption: q.correctOption || null,
                        rubric: q.rubric
                          ? (q.rubric as { criterion: string; marks: number }[])
                          : undefined,
                        order: q.order,
                      }}
                      onSubmit={(data) =>
                        handleEditSubmit(q.id, { ...data, order: q.order })
                      }
                      onCancel={() => setEditingId(null)}
                      submitText="Update Question"
                    />
                  </CardContent>
                </Card>
              );
            }

            return (
              <Card key={q.id} className={isLocked ? "opacity-90" : ""}>
                <CardHeader className="flex flex-row items-start justify-between py-4">
                  <div className="flex gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          Question {index + 1}
                        </span>
                        <Badge variant="outline">
                          {q.type === "MULTIPLE_CHOICE" ? "MCQ" : "Descriptive"}
                        </Badge>
                        <Badge variant="secondary">{q.points} pt</Badge>
                      </div>
                      <CardTitle className="font-normal text-base mt-2">
                        <RichTextViewer content={q.text} />
                      </CardTitle>
                    </div>
                  </div>
                  {!isLocked && (
                    <div className="-mt-2 -mr-2 flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-primary"
                        onClick={() => setMovingQuestionId(q.id)}
                        disabled={deletingId === q.id || editingId !== null}
                        title="Move Question"
                      >
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-primary"
                        onClick={() => setEditingId(q.id)}
                        disabled={deletingId === q.id || editingId !== null}
                        title="Edit Question"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(q.id)}
                        disabled={deletingId === q.id || editingId !== null}
                        title="Delete Question"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardHeader>

                {q.type === "MULTIPLE_CHOICE" && q.options && (
                  <CardContent className="ml-10 py-0 pb-4">
                    <ul className="space-y-2 mt-2">
                      {(q.options as unknown as Option[]).map((opt, i) => (
                        <li
                          key={opt.id || i}
                          className={`flex flex-col gap-2 rounded-md p-3 text-sm border ${opt.id === q.correctOption ? "border-green-500 bg-green-500/10 font-medium text-green-700 dark:text-green-400" : "border-transparent bg-muted/50"}`}
                        >
                          <div className="flex items-center gap-2">
                            {opt.id === q.correctOption ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                            ) : (
                              <div className="border-muted-foreground/30 mr-1 ml-1 h-4 w-4 rounded-full border shrink-0" />
                            )}
                            <span className="break-words">{opt.text}</span>
                          </div>
                          {opt.imageUrl && (
                            <div className="ml-7">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={opt.imageUrl} alt="Option image" className="max-h-24 rounded-md border " />
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                )}

                {q.type === "DESCRIPTIVE" && (
                  <CardContent className="ml-10 py-0 pb-4">
                    {q.rubric &&
                    (q.rubric as { criterion: string; marks: number }[])
                      .length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                          Marking Rubric
                        </p>
                        <ul className="space-y-1.5">
                          {(
                            q.rubric as { criterion: string; marks: number }[]
                          ).map((item, i) => (
                            <li
                              key={i}
                              className="bg-muted/50 flex items-center justify-between rounded-md px-3 py-2 text-sm"
                            >
                              <span className="text-foreground/80">
                                {item.criterion}
                              </span>
                              <Badge variant="secondary" className="ml-2 shrink-0">
                                {item.marks} pt
                              </Badge>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm italic">
                        No rubric defined — manual grading only.
                      </p>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Add Question Form */}
      {isAdding ? (
        <Card className="border-primary/50 ">
          <CardHeader>
            <CardTitle>Add New Question</CardTitle>
            <CardDescription>
              Fill out the details for your new question.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QuestionForm
              initialValues={{
                type: "MULTIPLE_CHOICE",
                text: "",
                points: 1,
                options: Array.from({ length: 4 }).map(() => ({ id: crypto.randomUUID(), text: "" })),
                correctOption: null,
                order: initialQuestions.length + 1,
              }}
              onSubmit={handleAddSubmit}
              onCancel={() => setIsAdding(false)}
              submitText="Save Question"
            />
          </CardContent>
        </Card>
      ) : !isLocked ? (
        <Button
          variant="outline"
          className="text-muted-foreground hover:text-foreground w-full border-dashed py-8"
          onClick={() => setIsAdding(true)}
          disabled={editingId !== null}
        >
          <PlusCircle className="mr-2 h-5 w-5" /> Add Question
        </Button>
      ) : null}

      {computedState === "ACTIVE" && (
        <div className="bg-primary/10 text-primary border-primary/20 mt-8 flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5" />
            <div>
              <h4 className="text-sm font-semibold">
                Exam is Currently Active
              </h4>
              <p className="text-xs opacity-90">
                Questions cannot be edited or added while examinees are actively
                taking the test.
              </p>
            </div>
          </div>
        </div>
      )}

      {computedState === "CLOSED" && (
        <div className="bg-destructive/10 text-destructive border-destructive/20 mt-8 flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5" />
            <div>
              <h4 className="text-sm font-semibold">Exam is Closed</h4>
              <p className="text-xs opacity-90">
                This exam has concluded and questions can no longer be modified.
              </p>
            </div>
          </div>
        </div>
      )}

      {computedState === "DRAFT" && (
        <div className="mt-12 flex justify-end border-t pt-8">
          <Button
            size="lg"
            onClick={handlePublish}
            disabled={
              isPublishing ||
              initialQuestions.length === 0 ||
              isAdding ||
              editingId !== null
            }
          >
            {isPublishing ? "Publishing..." : "Publish Exam"}
          </Button>
        </div>
      )}

      {computedState === "PUBLISHED" && (
        <div className="bg-primary/10 text-primary mt-8 flex items-center justify-between rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5" />
            <div>
              <h4 className="text-sm font-semibold">Exam is Published</h4>
              <p className="text-xs opacity-90">
                This exam is visible to examinees and has no future start
                constraint. It will be active immediately.
              </p>
            </div>
          </div>
        </div>
      )}

      {computedState === "SCHEDULED" && (
        <div className="bg-secondary/20 text-secondary-foreground border-secondary mt-8 flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5" />
            <div>
              <h4 className="text-sm font-semibold">Exam is Scheduled</h4>
              <p className="text-xs opacity-90">
                Examinees can now see this exam on their dashboard, but it has
                not started yet. You can still edit questions.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Move Question Dialog */}
      {movingQuestionId && (
        <MoveQuestionDialog
          isOpen={movingQuestionId !== null}
          onOpenChange={(open) => !open && setMovingQuestionId(null)}
          currentPosition={
            questions.findIndex((q) => q.id === movingQuestionId) + 1 || 1
          }
          totalQuestions={questions.length}
          onMove={handleMoveConfirm}
        />
      )}
    </div>
  );
}

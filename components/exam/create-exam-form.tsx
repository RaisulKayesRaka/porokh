"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { examSchema, ExamInput, ExamFormInput } from "@/lib/validations/exam";
import { createExam } from "@/app/actions/exam";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
  FieldContent,
} from "@/components/ui/field";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CreateExamFormProps {
  roomId: string;
  examinees: { id: string; name: string; email: string }[];
}

export function CreateExamForm({ roomId, examinees }: CreateExamFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ExamFormInput, undefined, ExamInput>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: "",
      description: "",
      timeLimitMinutes: undefined,
      isRestricted: false,
      allowedExamineeIds: [],
    },
  });

  const [searchQuery, setSearchQuery] = useState("");

  const filteredExaminees = examinees.filter(
    (examinee) =>
      examinee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      examinee.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const onSubmit = async (data: ExamInput) => {
    const result = await createExam(roomId, data);

    if (result.error) {
      toast.error(result.error.message || "Failed to create exam.");
    } else {
      toast.success("Exam drafted successfully.");
      // Redirect to the exam builder for this new draft
      if (result.exam) {
        router.push(`/rooms/${roomId}/exams/${result.exam.id}/edit`);
      }
    }
  };

  return (
    <TooltipProvider>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="title">Exam Title *</FieldLabel>
            <FieldContent>
              <Input
                id="title"
                placeholder="Midterm Exam, Quiz 1, etc."
                {...register("title")}
                disabled={isSubmitting}
              />
            </FieldContent>
            {errors.title && <FieldError>{errors.title.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="description">
              Description (Optional)
            </FieldLabel>
            <FieldContent>
              <Textarea
                id="description"
                placeholder="Instructions or details about this exam..."
                className="resize-none"
                {...register("description")}
                disabled={isSubmitting}
              />
            </FieldContent>
            {errors.description && (
              <FieldError>{errors.description.message}</FieldError>
            )}
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel
                htmlFor="startTime"
                className="flex items-center gap-2"
              >
                Start Time
                <Tooltip>
                  <TooltipTrigger
                    tabIndex={-1}
                    type="button"
                    className="cursor-help"
                  >
                    <Info className="text-muted-foreground h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p>
                      The exact date and time when the exam becomes available to
                      examinees.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </FieldLabel>
              <FieldContent>
                <Input
                  id="startTime"
                  type="datetime-local"
                  {...register("startTime")}
                  disabled={isSubmitting}
                />
              </FieldContent>
              {errors.startTime && (
                <FieldError>{errors.startTime.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="endTime" className="flex items-center gap-2">
                End Time
                <Tooltip>
                  <TooltipTrigger
                    tabIndex={-1}
                    type="button"
                    className="cursor-help"
                  >
                    <Info className="text-muted-foreground h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p>
                      The absolute deadline when the exam closes for everyone,
                      regardless of when they started.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </FieldLabel>
              <FieldContent>
                <Input
                  id="endTime"
                  type="datetime-local"
                  {...register("endTime")}
                  disabled={isSubmitting}
                />
              </FieldContent>
              {errors.endTime && (
                <FieldError>{errors.endTime.message}</FieldError>
              )}
            </Field>
          </div>

          <Field>
            <FieldLabel
              htmlFor="timeLimitMinutes"
              className="flex items-center gap-2"
            >
              Time Limit in Minutes
              <Tooltip>
                <TooltipTrigger
                  tabIndex={-1}
                  type="button"
                  className="cursor-help"
                >
                  <Info className="text-muted-foreground h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p>
                    The duration (in minutes) an examinee has to complete the
                    exam once they click Start.
                  </p>
                </TooltipContent>
              </Tooltip>
            </FieldLabel>
            <FieldContent>
              <Input
                id="timeLimitMinutes"
                type="number"
                placeholder="e.g. 60"
                {...register("timeLimitMinutes", { valueAsNumber: true })}
                disabled={isSubmitting}
                min={1}
              />
            </FieldContent>
            {errors.timeLimitMinutes && (
              <FieldError>{errors.timeLimitMinutes.message}</FieldError>
            )}
          </Field>

          <Field className="border-t pt-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <FieldLabel htmlFor="isRestricted">
                  Restrict Participation
                </FieldLabel>
                <p className="text-muted-foreground text-sm">
                  If enabled, only explicitly selected examinees can take this
                  exam.
                </p>
              </div>
              <Switch
                id="isRestricted"
                checked={watch("isRestricted")}
                onCheckedChange={(checked) => setValue("isRestricted", checked)}
                disabled={isSubmitting}
              />
            </div>
          </Field>

          {watch("isRestricted") && (
            <Field className="animate-in fade-in slide-in-from-top-4">
              <FieldLabel>Select Examinees</FieldLabel>
              <p className="text-muted-foreground mb-2 text-sm">
                Check the boxes of examinees allowed to participate.
              </p>
              <FieldContent>
                <div className="mb-3 flex flex-col gap-3">
                  <Input
                    placeholder="Search examinees by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="select-all-examinees"
                      checked={
                        examinees.length > 0 &&
                        (watch("allowedExamineeIds") || []).length === examinees.length
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setValue("allowedExamineeIds", examinees.map(e => e.id), { shouldValidate: true });
                        } else {
                          setValue("allowedExamineeIds", [], { shouldValidate: true });
                        }
                      }}
                      disabled={isSubmitting || examinees.length === 0}
                    />
                    <label
                      htmlFor="select-all-examinees"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                    >
                      Select All
                      <span className="text-muted-foreground font-normal">
                        ({(watch("allowedExamineeIds") || []).length} / {examinees.length} selected)
                      </span>
                    </label>
                  </div>
                </div>
                <div className="h-64 overflow-y-auto rounded-md border p-4">
                  {examinees.length === 0 ? (
                    <p className="text-muted-foreground py-4 text-center text-sm">
                      No examinees found in this room.
                    </p>
                  ) : filteredExaminees.length === 0 ? (
                    <p className="text-muted-foreground py-4 text-center text-sm">
                      No examinees match your search.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {filteredExaminees.map((examinee) => {
                        const currentIds = watch("allowedExamineeIds") || [];
                        const isChecked = currentIds.includes(examinee.id);
                        return (
                          <div
                            key={examinee.id}
                            className="flex flex-row items-start space-x-3"
                          >
                            <Checkbox
                              id={`examinee-${examinee.id}`}
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                const newIds = checked
                                  ? [...currentIds, examinee.id]
                                  : currentIds.filter(
                                      (id: string) => id !== examinee.id,
                                    );
                                setValue("allowedExamineeIds", newIds, {
                                  shouldValidate: true,
                                });
                              }}
                              disabled={isSubmitting}
                            />
                            <div className="space-y-1 leading-none">
                              <label
                                htmlFor={`examinee-${examinee.id}`}
                                className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {examinee.name}
                              </label>
                              <p className="text-muted-foreground text-sm">
                                {examinee.email}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </FieldContent>
              {errors.allowedExamineeIds && (
                <FieldError>{errors.allowedExamineeIds.message}</FieldError>
              )}
            </Field>
          )}
        </FieldGroup>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/rooms/${roomId}/exams`)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Draft & Add Questions"}
          </Button>
        </div>
      </form>
    </TooltipProvider>
  );
}

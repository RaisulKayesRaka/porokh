"use client";

import { useState } from "react";
import { useForm, useFieldArray, Controller, Control, UseFormRegister, UseFormWatch, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PlusCircle, X, Link } from "lucide-react";

import { questionSchema, QuestionInput, QuestionFormInput } from "@/lib/validations/exam";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
  FieldContent,
} from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface QuestionFormProps {
  initialValues: Partial<QuestionInput>;
  onSubmit: (data: QuestionInput) => Promise<boolean | void>;
  onCancel: () => void;
  submitText?: string;
}

export function QuestionForm({
  initialValues,
  onSubmit,
  onCancel,
  submitText = "Save Question",
}: QuestionFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<QuestionFormInput>({
    resolver: zodResolver(questionSchema),
    defaultValues: initialValues as QuestionFormInput,
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "options",
  });

  const questionType = watch("type");
  const options = watch("options") || [];
  const correctOptionVal = watch("correctOption");

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [activeOptionIndex, setActiveOptionIndex] = useState<number | null>(null);

  const handleImageUrlInsert = (index: number) => {
    setActiveOptionIndex(index);
    setImageUrlInput("");
    setIsImageModalOpen(true);
  };

  const handleFormSubmit = async (data: QuestionFormInput) => {
    const cleanedData = { ...data } as QuestionInput;

    if (cleanedData.type === "DESCRIPTIVE") {
      cleanedData.options = [];
      cleanedData.correctOption = null;
    } else if (cleanedData.type === "MULTIPLE_CHOICE" && cleanedData.options) {
      const validOptions = cleanedData.options.filter(
        (opt) => (opt.text && opt.text.trim() !== "") || opt.imageUrl
      );
      if (validOptions.length < 2) {
        toast.error("Please provide at least 2 valid options (text or image).");
        return;
      }
      cleanedData.options = validOptions;

      if (!cleanedData.correctOption) {
        toast.error("Please select a correct option.");
        return;
      }
      
      const isCorrectOptionValid = validOptions.some((opt) => opt.id === cleanedData.correctOption);
      if (!isCorrectOptionValid) {
        toast.error("Please select a valid correct option.");
        return;
      }

      cleanedData.rubric = undefined;
    }

    await onSubmit(cleanedData);
  };

  return (
    <>
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="space-y-6">
        <FieldGroup>
          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Question Type</FieldLabel>
              <FieldContent>
                <Select
                  onValueChange={(val) => setValue("type", val as QuestionInput["type"])}
                  defaultValue={questionType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MULTIPLE_CHOICE">
                      Multiple Choice
                    </SelectItem>
                    <SelectItem value="DESCRIPTIVE">Descriptive</SelectItem>
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Points</FieldLabel>
              <FieldContent>
                <Input
                  type="number"
                  min={0}
                  step={0.5}
                  {...register("points", { valueAsNumber: true })}
                />
              </FieldContent>
              {errors.points && (
                <FieldError>{errors.points.message as string}</FieldError>
              )}
            </Field>
          </div>

          <Field>
            <FieldLabel>Question Text</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="text"
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </FieldContent>
            {errors.text && (
              <FieldError>{errors.text.message as string}</FieldError>
            )}
          </Field>

          {questionType === "MULTIPLE_CHOICE" && (
            <div className="space-y-4 border-t pt-2">
              <h4 className="text-sm font-medium">Options</h4>
              <p className="text-muted-foreground mb-4 text-xs">
                Select the radio button next to the correct answer. Options can have text, image, or both.
              </p>

              {fields.map((field, index) => {
                const opt = options[index];
                const optionId = opt?.id || field.id;
                
                return (
                  <div key={field.id} className="flex flex-col gap-2 rounded-md border p-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        value={optionId}
                        {...register("correctOption")}
                        className="text-primary focus:ring-primary h-4 w-4"
                        checked={correctOptionVal === optionId}
                      />
                      <Input
                        placeholder={`Option ${index + 1} text`}
                        {...register(`options.${index}.text` as const)}
                      />
                      <input 
                        type="hidden" 
                        {...register(`options.${index}.id` as const)} 
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleImageUrlInsert(index)}
                        title="Insert Image URL"
                      >
                        <Link className="size-4" />
                      </Button>
                      {index >= 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive shrink-0"
                          onClick={() => remove(index)}
                        >
                          <X className="size-4" />
                        </Button>
                      )}
                    </div>
                    {opt?.imageUrl && (
                      <div className="relative mt-2 ml-7 inline-block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={opt.imageUrl} alt="Option image" className="max-h-32 rounded-md border" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          onClick={() => {
                            const currentOption = options[index];
                            update(index, { ...currentOption, imageUrl: undefined });
                          }}
                        >
                          <X className="size-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ id: crypto.randomUUID(), text: "" })}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Option
              </Button>

              {errors.options && (
                <p className="text-destructive mt-2 text-sm font-medium">
                  {errors.options.message as string}
                </p>
              )}
            </div>
          )}

          {questionType === "DESCRIPTIVE" && (
            <RubricBuilder
              control={control}
              register={register}
              watch={watch}
              errors={errors}
            />
          )}
        </FieldGroup>
      </div>
      <div className="mt-6 flex justify-end gap-2 border-t pt-6">
        <Button
          variant="ghost"
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitText}
        </Button>
      </div>
    </form>

      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Insert Image URL</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder="https://example.com/image.png"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (imageUrlInput.trim() !== "" && activeOptionIndex !== null) {
                    const currentOption = options[activeOptionIndex];
                    update(activeOptionIndex, { ...currentOption, imageUrl: imageUrlInput.trim() });
                    setIsImageModalOpen(false);
                  }
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setIsImageModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (imageUrlInput.trim() !== "" && activeOptionIndex !== null) {
                  const currentOption = options[activeOptionIndex];
                  update(activeOptionIndex, { ...currentOption, imageUrl: imageUrlInput.trim() });
                  setIsImageModalOpen(false);
                }
              }}
            >
              Insert Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function RubricBuilder({
  control,
  register,
  watch,
  errors,
}: {
  control: Control<QuestionFormInput>;
  register: UseFormRegister<QuestionFormInput>;
  watch: UseFormWatch<QuestionFormInput>;
  errors: FieldErrors<QuestionFormInput>;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "rubric",
  });

  const rubric = watch("rubric") || [];
  const points = watch("points") || 0;
  const rubricTotal = rubric.reduce(
    (sum: number, item) => sum + (Number(item?.marks) || 0),
    0,
  );

  return (
    <div className="space-y-4 border-t pt-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium">Marking Rubric</h4>
          <p className="text-muted-foreground text-xs">
            Define what earns marks. AI will grade based on these criteria.
          </p>
        </div>
        <span
          className={`text-sm font-medium ${
            rubricTotal > points
              ? "text-destructive"
              : rubricTotal === points
                ? "text-green-600 dark:text-green-400"
                : "text-muted-foreground"
          }`}
        >
          {rubricTotal} / {points} pts allocated
        </span>
      </div>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="bg-muted/30 flex items-start gap-3 rounded-md border p-3"
        >
          <div className="flex-1">
            <Input
              placeholder="e.g. Mentions the role of mitochondria"
              {...register(`rubric.${index}.criterion` as const)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={0}
              step={0.5}
              className="w-20 text-center"
              placeholder="Marks"
              {...register(`rubric.${index}.marks` as const, { valueAsNumber: true })}
            />
            <span className="text-muted-foreground text-xs">pts</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive shrink-0"
              onClick={() => remove(index)}
            >
              &times;
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ criterion: "", marks: 0 })}
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Add Criterion
      </Button>

      {errors.rubric && (
        <p className="text-destructive mt-1 text-sm font-medium">
          {typeof errors.rubric === "object" && "message" in errors.rubric
            ? (errors.rubric.message as string)
            : "Invalid rubric configuration."}
        </p>
      )}
    </div>
  );
}

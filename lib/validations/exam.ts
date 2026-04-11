import * as z from "zod";

const datePreprocess = z.preprocess((arg) => {
  if (typeof arg === "string") {
    if (arg.trim() === "") return null;
    const d = new Date(arg);
    return isNaN(d.getTime()) ? null : d;
  }
  if (arg instanceof Date) {
    return isNaN(arg.getTime()) ? null : arg;
  }
  return null;
}, z.date().optional().nullable());

const numberPreprocess = z.preprocess((arg) => {
  if (typeof arg === "string") {
    if (arg.trim() === "") return null;
    const parsed = Number(arg);
    return isNaN(parsed) ? null : parsed;
  }
  if (typeof arg === "number") {
    return isNaN(arg) ? null : arg;
  }
  return null;
}, z.number().int().min(1).optional().nullable());

export const examSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(100),
    description: z.string().max(1000).optional(),
    startTime: datePreprocess,
    endTime: datePreprocess,
    timeLimitMinutes: numberPreprocess,
    isRestricted: z.boolean().default(false),
    allowedExamineeIds: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return data.endTime > data.startTime;
      }
      return true;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    },
  )
  .refine(
    (data) => {
      const hasFixedSchedule = !!(data.startTime && data.endTime);
      const hasDuration = !!data.timeLimitMinutes;
      return hasFixedSchedule || hasDuration;
    },
    {
      message:
        "You must specify either a precise Start & End time, or a Time Limit duration.",
      path: ["timeLimitMinutes"],
    },
  )
  .refine(
    (data) => {
      if (
        (data.startTime && !data.endTime) ||
        (!data.startTime && data.endTime)
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "If scheduling the exam, both Start and End times must be provided.",
      path: ["endTime"],
    },
  )
  .refine(
    (data) => {
      if (data.startTime && data.endTime && data.timeLimitMinutes) {
        const durationMs = data.endTime.getTime() - data.startTime.getTime();
        const durationMins = durationMs / (1000 * 60);
        return data.timeLimitMinutes <= durationMins;
      }
      return true;
    },
    {
      message:
        "Time limit cannot exceed the duration between start and end time.",
      path: ["timeLimitMinutes"],
    },
  );

export type ExamInput = z.infer<typeof examSchema>;
export type ExamFormInput = z.input<typeof examSchema>;

export const questionSchema = z
  .object({
    type: z.enum(["MULTIPLE_CHOICE", "DESCRIPTIVE"]),
    text: z.string().min(1, "Question text is required"),
    points: z.number().min(0).default(1),
    options: z.array(
      z.object({
        id: z.string(),
        text: z.string().optional(),
        imageUrl: z.string().optional(),
        imagePublicId: z.string().optional(),
      })
    ).optional(),
    correctOption: z.string().optional().nullable(),
    rubric: z
      .array(
        z.object({
          criterion: z.string().min(1, "Criterion text is required"),
          marks: z.number().min(0, "Marks must be non-negative"),
        }),
      )
      .optional(),
    order: z.number().int().default(0),
  })
  .refine(
    (data) => {
      if (data.type === "MULTIPLE_CHOICE") {
        return data.options && data.options.length >= 2 && data.correctOption;
      }
      return true;
    },
    {
      message:
        "Multiple choice questions require at least two options and a correct option.",
      path: ["options"],
    },
  )
  .refine(
    (data) => {
      if (
        data.type === "DESCRIPTIVE" &&
        data.rubric &&
        data.rubric.length > 0
      ) {
        const rubricTotal = data.rubric.reduce(
          (sum, item) => sum + item.marks,
          0,
        );
        return rubricTotal <= data.points;
      }
      return true;
    },
    {
      message:
        "The sum of rubric marks cannot exceed the question's total points.",
      path: ["rubric"],
    },
  );

export type QuestionInput = z.infer<typeof questionSchema>;
export type QuestionFormInput = z.input<typeof questionSchema>;

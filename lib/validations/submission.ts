import * as z from "zod";

export const saveAnswerSchema = z.object({
  questionId: z.string().cuid(),
  textValue: z.string().optional().nullable(),
  optionValue: z.string().optional().nullable(),
  timeSpentSeconds: z.number().int().nonnegative().optional(),
  pasteCount: z.number().int().nonnegative().optional(),
  pastedTextLength: z.number().int().nonnegative().optional(),
  attachments: z.array(z.object({
    url: z.string(),
    publicId: z.string(),
    name: z.string()
  })).optional().nullable(),
});

export type SaveAnswerInput = z.infer<typeof saveAnswerSchema>;

export const gradeAnswerSchema = z.object({
  answerId: z.string().cuid(),
  score: z.number().min(0),
  feedback: z.string().optional().nullable(),
});

export type GradeAnswerInput = z.infer<typeof gradeAnswerSchema>;

export const applyPenaltySchema = z.object({
  penalty: z.number().min(0, "Penalty must be 0 or positive"),
  penaltyReason: z.string().optional().nullable(),
});

export type ApplyPenaltyInput = z.infer<typeof applyPenaltySchema>;

export const saveOverallFeedbackSchema = z.object({
  overallFeedback: z.string().optional().nullable(),
});

export type SaveOverallFeedbackInput = z.infer<typeof saveOverallFeedbackSchema>;

import * as z from "zod";

export const updateNameSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }).max(50, {
    message: "Name must not exceed 50 characters."
  }),
});

export type UpdateNameInput = z.infer<typeof updateNameSchema>;

export const updateImageSchema = z.object({
  imageUrl: z.string().url({ message: "Please enter a valid URL." }).or(z.literal("")),
});

export type UpdateImageInput = z.infer<typeof updateImageSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, {
    message: "Current password is required.",
  }),
  newPassword: z.string().min(8, {
    message: "New password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Confirm password must be at least 8 characters.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const changeEmailSchema = z.object({
  newEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required to change your email.",
  }),
});

export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  changePasswordSchema,
  ChangePasswordInput,
} from "@/lib/validations/user";
import { changePassword } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
  FieldContent,
} from "@/components/ui/field";

export function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordInput) => {
    const { error } = await changePassword({
      newPassword: data.newPassword,
      currentPassword: data.currentPassword,
      revokeOtherSessions: true,
    });

    if (error) {
      toast.error(
        error.message ||
          "Failed to change password. Make sure your current password is correct.",
      );
    } else {
      toast.success(
        "Password changed successfully! Other sessions have been revoked.",
      );
      reset(); // clear fields
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="currentPassword">Current Password</FieldLabel>
          <FieldContent>
            <Input
              id="currentPassword"
              type="password"
              {...register("currentPassword")}
              disabled={isSubmitting}
              aria-invalid={!!errors.currentPassword}
            />
          </FieldContent>
          {errors.currentPassword && (
            <FieldError>{errors.currentPassword.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
          <FieldContent>
            <Input
              id="newPassword"
              type="password"
              {...register("newPassword")}
              disabled={isSubmitting}
              aria-invalid={!!errors.newPassword}
            />
          </FieldContent>
          {errors.newPassword && (
            <FieldError>{errors.newPassword.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">
            Confirm New Password
          </FieldLabel>
          <FieldContent>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              disabled={isSubmitting}
              aria-invalid={!!errors.confirmPassword}
            />
          </FieldContent>
          {errors.confirmPassword && (
            <FieldError>{errors.confirmPassword.message}</FieldError>
          )}
        </Field>
      </FieldGroup>
      <div className="flex justify-end">
        <Button type="submit" disabled={!isDirty || isSubmitting}>
          {isSubmitting ? "Changing Password..." : "Change Password"}
        </Button>
      </div>
    </form>
  );
}

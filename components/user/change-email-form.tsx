"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { changeEmailSchema, ChangeEmailInput } from "@/lib/validations/user";
import { emailOtp } from "@/lib/auth-client";
import { verifyUserPassword } from "@/app/actions/user";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
  FieldContent,
} from "@/components/ui/field";
import { CheckCircle2Icon } from "lucide-react";
import { OtpInput } from "@/components/ui/otp-input";

type ChangeEmailFormProps = {
  currentEmail: string;
};

export function ChangeEmailForm({ currentEmail }: ChangeEmailFormProps) {
  const [step, setStep] = useState<"form" | "otp" | "success">("form");
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<ChangeEmailInput>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      newEmail: "",
      password: "",
    },
  });

  const onSubmit = async (data: ChangeEmailInput) => {
    if (data.newEmail === currentEmail) {
      toast.error("New email must be different from your current email.");
      return;
    }

    // Verify password first
    const result = await verifyUserPassword(data.password);
    if (!result.success) {
      toast.error(result.error || "Incorrect password.");
      return;
    }

    // Request email change → sends OTP to new email
    setIsSendingOtp(true);
    const res = await emailOtp.requestEmailChange({
      newEmail: data.newEmail,
    });

    if (res.error) {
      toast.error(res.error.message || "Failed to send verification code.");
      setIsSendingOtp(false);
      return;
    }

    setNewEmail(data.newEmail);
    setStep("otp");
    setIsSendingOtp(false);
  };

  async function handleVerifyOtp() {
    setOtpError(null);
    setIsVerifying(true);

    const res = await emailOtp.changeEmail({
      newEmail,
      otp,
    });

    if (res.error) {
      setOtpError(res.error.message || "Invalid code. Please try again.");
      setIsVerifying(false);
    } else {
      setStep("success");
      setIsVerifying(false);
      reset();
    }
  }

  async function handleResendOtp() {
    setIsSendingOtp(true);
    setOtpError(null);

    await emailOtp.requestEmailChange({ newEmail });

    setIsSendingOtp(false);
    setOtp("");
  }

  if (step === "success") {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2Icon className="h-5 w-5 text-green-500" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Email changed successfully</p>
          <p className="text-muted-foreground text-sm">
            Your email has been updated to <strong>{newEmail}</strong>.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
        >
          Done
        </Button>
      </div>
    );
  }

  if (step === "otp") {
    return (
      <div className="flex flex-col gap-4 py-2">
        <p className="text-muted-foreground text-center text-sm">
          We&apos;ve sent a 6-digit code to <strong>{newEmail}</strong>. Enter
          it below to confirm the change.
        </p>
        {otpError && (
          <p className="text-destructive text-center text-sm font-medium">
            {otpError}
          </p>
        )}
        <OtpInput value={otp} onChange={setOtp} disabled={isVerifying} />
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setStep("form");
              setOtp("");
              setOtpError(null);
            }}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleVerifyOtp}
            disabled={otp.length < 6 || isVerifying}
          >
            {isVerifying && <Spinner data-icon="inline-start" />}
            {isVerifying ? "Verifying..." : "Verify"}
          </Button>
        </div>
        <div className="text-center">
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isSendingOtp}
            className="text-muted-foreground hover:text-primary text-sm underline-offset-4 hover:underline disabled:opacity-50"
          >
            {isSendingOtp ? "Sending..." : "Didn't get the code? Resend"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="currentEmail">Current Email</FieldLabel>
          <FieldContent>
            <Input id="currentEmail" value={currentEmail} disabled />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="newEmail">New Email</FieldLabel>
          <FieldContent>
            <Input
              id="newEmail"
              type="email"
              placeholder="new@example.com"
              {...register("newEmail")}
              disabled={isSubmitting || isSendingOtp}
              aria-invalid={!!errors.newEmail}
            />
          </FieldContent>
          {errors.newEmail && (
            <FieldError>{errors.newEmail.message}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="emailPassword">Confirm Password</FieldLabel>
          <FieldContent>
            <Input
              id="emailPassword"
              type="password"
              placeholder="Enter your current password"
              {...register("password")}
              disabled={isSubmitting || isSendingOtp}
              aria-invalid={!!errors.password}
            />
          </FieldContent>
          {errors.password && (
            <FieldError>{errors.password.message}</FieldError>
          )}
        </Field>
      </FieldGroup>
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!isDirty || isSubmitting || isSendingOtp}
        >
          {(isSubmitting || isSendingOtp) && (
            <Spinner data-icon="inline-start" />
          )}
          {isSubmitting
            ? "Verifying..."
            : isSendingOtp
              ? "Sending code..."
              : "Change Email"}
        </Button>
      </div>
    </form>
  );
}

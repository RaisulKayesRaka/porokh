"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { emailOtp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  ArrowLeftIcon,
  EyeIcon,
  EyeOffIcon,
  CheckCircle2Icon,
} from "lucide-react";
import { OtpInput } from "@/components/ui/otp-input";

export default function ForgotPasswordClient() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [step, setStep] = useState<"email" | "otp" | "success">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isResending, setIsResending] = useState(false);

  async function handleSendOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const emailValue = formData.get("email") as string;

    const res = await emailOtp.requestPasswordReset({
      email: emailValue,
    });

    if (res.error) {
      setError(res.error.message || "Something went wrong.");
      setIsLoading(false);
    } else {
      setEmail(emailValue);
      setStep("otp");
      setIsLoading(false);
    }
  }

  async function handleResetPassword() {
    setError(null);

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    const res = await emailOtp.resetPassword({
      email,
      otp,
      password: newPassword,
    });

    if (res.error) {
      setError(res.error.message || "Invalid code or failed to reset.");
      setIsLoading(false);
    } else {
      setStep("success");
      setIsLoading(false);
    }
  }

  async function handleResendOtp() {
    setIsResending(true);
    setError(null);

    await emailOtp.requestPasswordReset({ email });

    setIsResending(false);
    setOtp("");
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="mt-2 mb-4 flex w-full justify-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/porokh.svg"
                alt="Porokh Logo"
                width={32}
                height={32}
                className="invert dark:invert-0"
              />
              <span className="text-3xl font-bold tracking-tight">Porokh</span>
            </Link>
          </div>
          <CardTitle className="text-center text-2xl">
            {step === "email" && "Forgot your password?"}
            {step === "otp" && "Reset your password"}
            {step === "success" && "Password reset!"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === "email" && (
            <form onSubmit={handleSendOtp}>
              <div className="flex flex-col gap-6">
                {error && (
                  <p className="text-destructive text-center text-sm font-medium">
                    {error}
                  </p>
                )}
                <p className="text-muted-foreground text-center text-sm">
                  Enter your email address and we&apos;ll send you a code to
                  reset your password.
                </p>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                  />
                </Field>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Spinner data-icon="inline-start" />}
                  {isLoading ? "Sending..." : "Send reset code"}
                </Button>
              </div>
            </form>
          )}

          {step === "otp" && (
            <div className="flex flex-col gap-4">
              <p className="text-muted-foreground text-center text-sm">
                We&apos;ve sent a 6-digit code to <strong>{email}</strong>.
                Enter it below with your new password.
              </p>
              {error && (
                <p className="text-destructive text-center text-sm font-medium">
                  {error}
                </p>
              )}
              <OtpInput value={otp} onChange={setOtp} disabled={isLoading} />
              <Field>
                <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <InputGroupAddon align="inline-end">
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground flex h-full cursor-pointer items-center justify-center px-3 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeIcon size={16} />
                      ) : (
                        <EyeOffIcon size={16} />
                      )}
                    </button>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </Field>
              <Button
                className="w-full"
                onClick={handleResetPassword}
                disabled={
                  otp.length < 6 || !newPassword || !confirmPassword || isLoading
                }
              >
                {isLoading && <Spinner data-icon="inline-start" />}
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="text-muted-foreground hover:text-primary text-sm underline-offset-4 hover:underline disabled:opacity-50"
                >
                  {isResending ? "Sending..." : "Didn't get the code? Resend"}
                </button>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle2Icon className="h-6 w-6 text-green-500" />
              </div>
              <p className="text-muted-foreground text-sm">
                Your password has been reset successfully. You can now log in
                with your new password.
              </p>
              <Button
                className="w-full"
                onClick={() => router.push("/login")}
              >
                Go to login
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="w-full text-center">
            <Link
              href="/login"
              className="text-muted-foreground hover:text-primary inline-flex items-center gap-1 text-sm underline-offset-4 hover:underline"
            >
              <ArrowLeftIcon size={14} />
              Back to login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

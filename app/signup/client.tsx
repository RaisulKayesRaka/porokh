"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signUp, emailOtp } from "@/lib/auth-client";
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
import { EyeOffIcon, EyeIcon, CheckCircle2Icon } from "lucide-react";
import { OtpInput } from "@/components/ui/otp-input";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // OTP verification state
  const [step, setStep] = useState<"form" | "otp" | "success">("form");
  const [signupEmail, setSignupEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signUp.email({
      name,
      email,
      password,
    });

    if (res.error) {
      setError(res.error.message || "Something went wrong.");
      setIsLoading(false);
    } else {
      setSignupEmail(email);
      setStep("otp");
      setIsLoading(false);
    }
  }

  async function handleVerifyOtp() {
    setError(null);
    setIsVerifying(true);

    const res = await emailOtp.verifyEmail({
      email: signupEmail,
      otp,
    });

    if (res.error) {
      setError(res.error.message || "Invalid code. Please try again.");
      setIsVerifying(false);
    } else {
      setStep("success");
      setIsVerifying(false);
    }
  }

  async function handleResendOtp() {
    setIsResending(true);
    setError(null);

    await emailOtp.sendVerificationOtp({
      email: signupEmail,
      type: "email-verification",
    });

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
            {step === "form" && "Create an account"}
            {step === "otp" && "Verify your email"}
            {step === "success" && "Email verified!"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === "form" && (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                {error && (
                  <p className="text-destructive text-center text-sm font-medium">
                    {error}
                  </p>
                )}
                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g. Raisul Kayes"
                    required
                  />
                </Field>
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
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
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
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Spinner data-icon="inline-start" />}
                  {isLoading ? "Signing up..." : "Sign up"}
                </Button>
              </div>
            </form>
          )}

          {step === "otp" && (
            <div className="flex flex-col gap-4">
              <p className="text-muted-foreground text-center text-sm">
                We&apos;ve sent a 6-digit code to{" "}
                <strong>{signupEmail}</strong>. Enter it below to verify your
                email.
              </p>
              {error && (
                <p className="text-destructive text-center text-sm font-medium">
                  {error}
                </p>
              )}
              <OtpInput
                value={otp}
                onChange={setOtp}
                disabled={isVerifying}
              />
              <Button
                className="w-full"
                onClick={handleVerifyOtp}
                disabled={otp.length < 6 || isVerifying}
              >
                {isVerifying && <Spinner data-icon="inline-start" />}
                {isVerifying ? "Verifying..." : "Verify Email"}
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
                Your email has been verified successfully. You can now log in to
                your account.
              </p>
              <Button className="w-full" onClick={() => router.push("/login")}>
                Go to login
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="text-muted-foreground w-full text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="hover:text-primary underline underline-offset-4"
            >
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn, emailOtp } from "@/lib/auth-client";
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
import { EyeIcon, EyeOffIcon, CheckCircle2Icon } from "lucide-react";
import { OtpInput } from "@/components/ui/otp-input";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // OTP verification state
  const [step, setStep] = useState<"form" | "otp" | "verified">("form");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  async function login(email: string, password: string) {
    setError(null);
    setIsLoading(true);

    const res = await signIn.email({
      email,
      password,
    });

    if (res.error) {
      if (res.error.status === 403) {
        setVerificationEmail(email);
        setStep("otp");
      } else {
        setError(res.error.message || "Something went wrong.");
      }
      setIsLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    await login(email, password);
  }

  async function handleVerifyOtp() {
    setError(null);
    setIsVerifying(true);

    const res = await emailOtp.verifyEmail({
      email: verificationEmail,
      otp,
    });

    if (res.error) {
      setError(res.error.message || "Invalid code. Please try again.");
      setIsVerifying(false);
    } else {
      setStep("verified");
      setIsVerifying(false);
    }
  }

  async function handleResendOtp() {
    setIsResending(true);
    setError(null);

    await emailOtp.sendVerificationOtp({
      email: verificationEmail,
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
            {step === "form" && "Welcome back"}
            {step === "otp" && "Verify your email"}
            {step === "verified" && "Email verified!"}
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
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Link
                      href="/forgot-password"
                      className="text-muted-foreground ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
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
                  {isLoading ? "Logging in..." : "Log in"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background text-muted-foreground px-2">
                      Or continue with demo
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() =>
                      login("raisulkayesofficial@gmail.com", "Password@123")
                    }
                    disabled={isLoading}
                  >
                    Examiner
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() =>
                      login("raka22205101402@diu.edu.bd", "Password@123")
                    }
                    disabled={isLoading}
                  >
                    Examinee
                  </Button>
                </div>
              </div>
            </form>
          )}

          {step === "otp" && (
            <div className="flex flex-col gap-4">
              <p className="text-muted-foreground text-center text-sm">
                Your email is not yet verified. We&apos;ve sent a 6-digit code
                to <strong>{verificationEmail}</strong>.
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

          {step === "verified" && (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle2Icon className="h-6 w-6 text-green-500" />
              </div>
              <p className="text-muted-foreground text-sm">
                Your email has been verified. Please log in to continue.
              </p>
              <Button
                className="w-full"
                onClick={() => {
                  setStep("form");
                  setOtp("");
                  setError(null);
                }}
              >
                Log in
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="text-muted-foreground w-full text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="hover:text-primary underline underline-offset-4"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

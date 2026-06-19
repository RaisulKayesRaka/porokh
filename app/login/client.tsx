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
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-8 font-sans overflow-hidden bg-gradient-to-b from-violet-50/50 to-background dark:from-violet-950/20 dark:to-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(124,58,237,0.08)_1px,_transparent_1px)] dark:bg-[radial-gradient(circle,_rgba(139,92,246,0.04)_1px,_transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="animate-fade-up z-10 w-full max-w-5xl flex flex-col lg:flex-row bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.08] rounded-3xl overflow-hidden">
        
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex flex-1 flex-col justify-between relative bg-violet-600 dark:bg-violet-900 p-12 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[size:24px_24px]" />
          
          <div className="relative z-10">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/porokh.svg"
                alt="Porokh Logo"
                width={32}
                height={32}
                className="brightness-0 invert"
              />
              <span className="text-3xl font-bold tracking-tight">Porokh</span>
            </Link>
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl font-semibold mb-6">Smarter Exams. Effortless Grading.</h2>
            <p className="text-violet-200 text-lg leading-relaxed">
              Sign in to continue managing your exams, rooms, and AI-graded assessments with ease.
            </p>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center">
          <div className="w-full max-w-sm mx-auto">
            <div className="mb-8 lg:hidden flex w-full justify-center">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/porokh.svg"
                  alt="Porokh Logo"
                  width={32}
                  height={32}
                  className=""
                />
                <span className="text-3xl font-bold tracking-tight">Porokh</span>
              </Link>
            </div>
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-2xl font-semibold tracking-tight">
                {step === "form" && "Welcome back"}
                {step === "otp" && "Verify your email"}
                {step === "verified" && "Email verified!"}
              </h1>
            </div>
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
                        aria-label="Toggle password visibility"
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
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  onClick={async () => {
                    await signIn.social({
                      provider: "google",
                      callbackURL: "/dashboard",
                    });
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
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
          
          <div className="mt-8 text-muted-foreground w-full text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="hover:text-primary underline underline-offset-4"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

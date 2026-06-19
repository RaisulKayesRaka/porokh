import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-gradient-to-b from-violet-50/80 via-background to-background dark:from-violet-950/30 dark:via-background dark:to-background">
      {/* Grid dot pattern overlay */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle,_rgba(124,58,237,0.12)_1px,_transparent_1px)] dark:bg-[radial-gradient(circle,_rgba(139,92,246,0.06)_1px,_transparent_1px)] bg-[size:24px_24px]"
        aria-hidden="true"
      />

      {/* Floating orbs */}
      <div
        className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-violet-400/20 dark:bg-violet-500/10 blur-3xl animate-pulse-glow"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-indigo-400/20 dark:bg-indigo-500/10 blur-3xl animate-pulse-glow"
        style={{ animationDelay: "2s" }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-violet-300/10 dark:bg-violet-500/5 blur-3xl animate-pulse-glow"
        style={{ animationDelay: "4s" }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto max-w-7xl px-6 md:px-8 flex flex-col items-center text-center py-20 md:py-28">
        {/* Badge */}
        <div
          className="animate-fade-up inline-flex items-center gap-2 border border-violet-200 dark:border-violet-500/20 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 rounded-full px-4 py-1.5 text-sm font-medium"
          style={{ animationDelay: "0ms" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-500 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500"></span>
          </span>
          AI-Powered Assessment Platform
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-up mt-8 text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]"
          style={{ animationDelay: "100ms" }}
        >
          <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500 dark:from-violet-400 dark:via-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Smarter Exams.
          </span>
          <br />
          <span className="text-foreground">Effortless Grading.</span>
        </h1>

        {/* Subtitle */}
        <p
          className="animate-fade-up text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-6"
          style={{ animationDelay: "200ms" }}
        >
          Create, proctor, and grade examinations with AI precision. The modern
          assessment platform that saves you hours while ensuring complete integrity.
        </p>

        {/* CTAs */}
        <div
          className="animate-fade-up flex flex-col sm:flex-row items-center gap-4 mt-10"
          style={{ animationDelay: "300ms" }}
        >
          <Button
            asChild
            size="lg"
            className="bg-violet-600 hover:bg-violet-700 text-white    transition-all duration-300"
          >
            <Link href="/signup">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#how-it-works">See How It Works</Link>
          </Button>
        </div>

        {/* Dashboard Mockup */}
        <div
          className="animate-fade-up mt-16 md:mt-20 w-full max-w-5xl mx-auto"
          style={{ animationDelay: "400ms" }}
        >
          <div className="[perspective:2000px]">
            <div className="[transform:rotateX(4deg)] transition-transform duration-700 hover:[transform:rotateX(0deg)]">
              <div className="   rounded-2xl overflow-hidden border border-black/10 dark:border-white/10">
                {/* Browser Chrome */}
                <div className="rounded-t-2xl bg-gray-800 dark:bg-gray-900 px-4 py-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <div className="flex-1 ml-4 h-6 rounded-md bg-gray-700/50 flex items-center px-3">
                    <span className="text-xs text-gray-400">
                      porokh.vercel.app/rooms
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="rounded-b-2xl border-t border-black/5 dark:border-white/5 overflow-hidden flex">
                  <Image
                    src="/rooms_image.jpeg"
                    alt="Porokh Dashboard"
                    width={1920}
                    height={1080}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

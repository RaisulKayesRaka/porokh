import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-700 py-24 md:py-32 dark:from-violet-800 dark:via-indigo-800 dark:to-violet-900">
      {/* Floating Orbs */}
      <div className="animate-pulse-glow absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="animate-pulse-glow absolute -right-32 -bottom-32 h-[28rem] w-[28rem] rounded-full bg-white/10 blur-3xl" />
      <div className="animate-pulse-glow absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />

      {/* Grid Dot Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[size:20px_20px]" />

      {/* Content */}
      <div className="container relative z-10 mx-auto max-w-7xl px-6 text-center md:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Ready to Transform Your Assessments?
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
          Join professionals and organizations who are saving hours every week with AI-powered
          grading. Get started in under a minute.
        </p>
        <div className="mt-10">
          <Button
            asChild
            size="lg"
            className="bg-white px-8 font-semibold text-violet-700   hover:bg-white/90"
          >
            <Link href="/signup">
              Get Started — It&apos;s Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

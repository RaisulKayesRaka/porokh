import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-6 md:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-violet-600 dark:bg-violet-900 border border-violet-500/30">
          {/* Floating Orbs inside the card */}
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -right-32 -bottom-32 h-[28rem] w-[28rem] rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl pointer-events-none" />

          {/* Grid Dot Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.12)_1px,_transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 px-6 py-12 text-center md:py-16 md:px-12">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Ready to Transform Your Assessments?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl leading-relaxed text-violet-100">
              Join professionals and organizations who are saving hours every week with AI-powered
              grading. Get started in under a minute.
            </p>
            <div className="mt-10 flex items-center justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-violet-700 hover:bg-white/90 border border-white/20 transition-all"
              >
                <Link href="/signup">
                  Get Started — It&apos;s Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

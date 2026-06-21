import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ShieldCheck,
  FileText,
  BookOpen,
  Users,
  BarChart3,
  Clock,
  ImagePlus,
  ClipboardCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Explore the full range of Porokh platform capabilities — AI-powered grading, proctoring, LaTeX support, analytics, and more.",
};

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Grading",
    description:
      "Leverage advanced AI to automatically evaluate descriptive answers against custom rubrics, saving hours of manual grading while maintaining accuracy and consistency.",
  },
  {
    icon: ShieldCheck,
    title: "Proctoring & Security",
    description:
      "Built-in tab-switch detection, paste monitoring, and activity logging ensures exam integrity. Every suspicious action is tracked and reported.",
  },
  {
    icon: FileText,
    title: "Rich Question Builder",
    description:
      "Create exams with descriptive and MCQ questions. Use the rich text editor with bold, italic, headings, lists, math formulas (LaTeX), and image embedding.",
  },
  {
    icon: BookOpen,
    title: "LaTeX Math Support",
    description:
      "Render complex mathematical formulas beautifully using inline and block LaTeX. Perfect for STEM subjects, physics, and engineering exams.",
  },
  {
    icon: Users,
    title: "Rooms & Collaboration",
    description:
      "Organize exams into rooms with unique join codes. Add multiple examiners as collaborators and manage access with role-based permissions.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description:
      "Get detailed performance analytics per question and per examinee. Identify weak areas, view score distributions, and track overall performance.",
  },
  {
    icon: Clock,
    title: "Timed Exams",
    description:
      "Set exam durations with automatic submission on timeout. Examinees see a live countdown timer, and late submissions are handled gracefully.",
  },
  {
    icon: ImagePlus,
    title: "Image Support",
    description:
      "Embed images in questions and MCQ options via URL. Enrich your exam content with diagrams, figures, and visual references.",
  },
  {
    icon: ClipboardCheck,
    title: "Custom Rubrics",
    description:
      "Define detailed marking rubrics for each descriptive question. Specify criteria and weightage so the AI grades precisely to your standards.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-gradient-to-b from-violet-50/50 to-background dark:from-violet-950/20 dark:to-background py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-6 md:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-primary mb-4 text-sm font-semibold uppercase tracking-widest">
              PLATFORM CAPABILITIES
            </p>
            <h1 className="text-foreground mb-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-violet-700 to-violet-400 dark:from-violet-300 dark:to-violet-500 bg-clip-text text-transparent">
                Conduct Exams
              </span>
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
              Porokh comes packed with features designed for examiners and
              examinees alike. From AI grading to real-time proctoring — we&apos;ve
              got you covered.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-6 hover:border-violet-500/30 dark:hover:border-violet-400/20 transition-all duration-300"
                >
                  <div className="bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-foreground mb-2 text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto max-w-7xl px-6 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-foreground mb-4 text-3xl font-semibold tracking-tight">
              Ready to get started?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Create your first exam in minutes — no credit card required.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/signup">Start Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/faqs">Read FAQs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

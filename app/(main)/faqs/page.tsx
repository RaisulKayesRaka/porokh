import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FAQAccordion } from "@/components/faq-accordion";

export const metadata: Metadata = {
  title: "FAQs — Porokh",
  description:
    "Find answers to frequently asked questions about Porokh — the AI-assisted online examination and evaluation platform.",
};

const faqCategories = [
  {
    category: "General",
    questions: [
      {
        q: "What is Porokh?",
        a: "Porokh is an AI-assisted online examination and evaluation platform designed for educational institutions. It lets examiners create, conduct, and grade exams — while examinees take them in a secure, proctored environment.",
      },
      {
        q: "Is Porokh free to use?",
        a: "Yes! Porokh is completely free to use. You can create rooms, build exams, and leverage AI-powered grading without any cost or credit card.",
      },
      {
        q: "Who can use Porokh?",
        a: "Porokh is built for examiners and examinees alike. Anyone conducting assessments — from schools to coaching centers — can benefit from the platform.",
      },
    ],
  },
  {
    category: "Exams & Questions",
    questions: [
      {
        q: "What types of questions can I create?",
        a: "Porokh supports two question types: Multiple Choice (MCQ) and Descriptive. MCQs are auto-graded instantly. Descriptive questions support rich text, math formulas (LaTeX), and image embedding — and can be graded by AI.",
      },
      {
        q: "Can I add images to my questions?",
        a: "Yes! You can embed images in questions and MCQ options by pasting a public image URL. There is no limit on the number of images per question for examiners.",
      },
      {
        q: "Does Porokh support math formulas?",
        a: "Absolutely. Porokh has built-in LaTeX support via the rich text editor. You can insert inline and block math formulas that render beautifully using KaTeX — perfect for STEM subjects.",
      },
      {
        q: "Can I reorder questions after creating them?",
        a: "Yes. You can drag-and-drop to reorder questions on the exam edit page before publishing. Once an exam is active or closed, the order is locked.",
      },
      {
        q: "What are rubrics and how do they work?",
        a: "Rubrics let you define grading criteria and marks for each descriptive question. The AI uses these rubrics to evaluate examinee answers, ensuring consistent and transparent scoring.",
      },
    ],
  },
  {
    category: "AI Grading",
    questions: [
      {
        q: "How does AI grading work?",
        a: "When an exam is closed, you can trigger AI grading for descriptive questions. The AI evaluates each examinee's answer against the question's rubric, assigning marks and providing detailed feedback for each criterion.",
      },
      {
        q: "Can the AI evaluate images in questions?",
        a: "Yes. The AI has vision capabilities and can analyze images embedded via URL in questions. This allows it to understand diagrams, figures, and visual context when grading related answers.",
      },
      {
        q: "Can examiners override AI grades?",
        a: "Yes. AI grades are a starting point. Examiners can review, adjust marks, and add their own feedback for every submission before publishing results.",
      },
    ],
  },
  {
    category: "Rooms & Access",
    questions: [
      {
        q: "What is a room?",
        a: "A room is a shared space where examiners organize exams and examinees join using a unique room code. Think of it as a virtual classroom for assessments.",
      },
      {
        q: "How do examinees join a room?",
        a: "Examinees click \u201cJoin Room\u201d from their dashboard and enter the room code shared by the examiner. Once joined, they can see all published exams in that room.",
      },
      {
        q: "Can multiple examiners manage the same room?",
        a: "Yes. The room owner can add other users as examiners, giving them the ability to create exams, view submissions, and grade answers.",
      },
    ],
  },
  {
    category: "Security & Proctoring",
    questions: [
      {
        q: "How does proctoring work in Porokh?",
        a: "Porokh monitors tab switches during an exam. Every time an examinee leaves the exam tab, the event is logged with a count. Examiners can see this data on the submissions page to assess exam integrity.",
      },
      {
        q: "Can examinees cheat by copying text?",
        a: "Paste actions are also monitored. If an examinee pastes text from an external source, it is flagged. Internal copy-paste within the editor is allowed and not penalized.",
      },
      {
        q: "Is my data secure?",
        a: "Yes. Porokh uses industry-standard security practices, including encrypted passwords, secure sessions, and server-side validation for all operations.",
      },
    ],
  },
  {
    category: "Results & Analytics",
    questions: [
      {
        q: "How do examinees see their results?",
        a: "After an examiner publishes results, examinees can view their scores, individual question feedback, and AI-generated evaluations from the results page within the exam.",
      },
      {
        q: "What analytics are available?",
        a: "Examiners get access to per-question analytics including average scores, score distributions, and the ability to review each examinee's answers individually.",
      },
      {
        q: "Can I publish results selectively?",
        a: "Results are published at the exam level. When you toggle results to published, all examinees in the room can see their scores for that exam.",
      },
    ],
  },
];

export default function FAQsPage() {
  return (
    <div className="bg-background relative overflow-hidden">
      {/* Background radial glow */}
      <div className="from-border/20 via-background to-background pointer-events-none absolute top-0 left-1/2 h-[600px] w-full -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]" />

      <div className="relative z-10 container mx-auto max-w-4xl px-4 py-20 md:px-8 md:py-28">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center md:mb-16">
          <p className="text-muted-foreground mb-3 text-sm font-semibold uppercase tracking-widest">
            Support
          </p>
          <h1 className="text-foreground mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Frequently Asked{" "}
            <span className="from-foreground to-foreground/50 bg-gradient-to-r bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Everything you need to know about using Porokh. Can&apos;t find what
            you&apos;re looking for? Feel free to reach out.
          </p>
        </div>

        {/* FAQ Sections */}
        <FAQAccordion categories={faqCategories} />

        {/* CTA */}
        <div className="bg-card mt-16 flex flex-col items-center gap-4 rounded-xl border p-8 text-center md:mt-20 md:p-12">
          <h2 className="text-foreground text-2xl font-bold">
            Still have questions?
          </h2>
          <p className="text-muted-foreground max-w-md">
            Jump right in and explore the platform yourself — it&apos;s the
            fastest way to find answers.
          </p>
          <div className="flex gap-3">
            <Button asChild size="lg">
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/features">View Features</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

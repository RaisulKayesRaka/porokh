import { FAQAccordion } from "@/components/faq-accordion";

const faqCategories = [
  {
    category: "General",
    questions: [
      {
        q: "Is Porokh free to use?",
        a: "Yes! Porokh is completely free. Create rooms, build exams, and use AI grading — no credit card required.",
      },
      {
        q: "How does AI grading work?",
        a: "When you close an exam, trigger AI grading for descriptive questions. The AI evaluates each answer against your rubric, assigning marks and providing detailed feedback.",
      },
      {
        q: "What anti-cheating features are available?",
        a: "Porokh monitors tab switches, detects paste events from external sources, and supports timed exams with auto-submission. All activities are logged and visible to examiners.",
      },
      {
        q: "Can multiple examiners collaborate?",
        a: "Absolutely. Room owners can add other users as examiners who can create exams, view submissions, and grade answers together.",
      },
    ],
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="bg-background py-24 md:py-32">
      <div className="container mx-auto max-w-7xl px-6 md:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center md:mb-20">
          <p className="text-primary mb-4 text-sm font-semibold uppercase tracking-widest">
            FAQ
          </p>
          <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Common Questions
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed md:text-xl">
            Quick answers to help you get started.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="mx-auto max-w-3xl">
          <FAQAccordion categories={faqCategories} />
        </div>
      </div>
    </section>
  );
}

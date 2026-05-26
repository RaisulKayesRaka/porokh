import { FAQAccordion } from "@/components/faq-accordion";

const categories = [
  {
    category: "General",
    questions: [
      {
        q: "What is Porokh?",
        a: "Porokh is a modern examination platform designed for secure and efficient digital testing.",
      },
      {
        q: "Is it free to use?",
        a: "We offer a generous free tier for individual educators, with professional plans for larger institutions.",
      },
    ],
  },
  {
    category: "Security",
    questions: [
      {
        q: "How do you prevent cheating?",
        a: "We use a combination of tab-switching detection, copy-paste restrictions, and randomized question orders.",
      },
      {
        q: "Can I restrict access to certain students?",
        a: "Yes, you can create restricted exams that only specific members of your room can access.",
      },
    ],
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="w-full py-20 bg-background border-b">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Everything you need to know about the platform.
          </p>
        </div>
        <FAQAccordion categories={categories} />
      </div>
    </section>
  );
}

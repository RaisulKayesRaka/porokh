"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FAQCategory = {
  category: string;
  questions: { q: string; a: string }[];
};

export function FAQAccordion({ categories }: { categories: FAQCategory[] }) {
  return (
    <div className="space-y-10">
      {categories.map((cat, catIndex) => (
        <div key={catIndex}>
          <h2 className="text-foreground mb-4 text-xl font-bold tracking-tight">
            {cat.category}
          </h2>
          <Accordion type="multiple" className="w-full">
            {cat.questions.map((faq, faqIndex) => (
              <AccordionItem
                key={faqIndex}
                value={`${catIndex}-${faqIndex}`}
                className="border-border/50"
              >
                <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  );
}

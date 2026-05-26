import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="w-full py-20 bg-background">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <div className="text-center">
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-5xl mb-6">
            Ready to Modernise Your Exams?
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of educators who are already saving time and ensuring exam integrity with Porokh. Start for free today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8 py-6 text-lg">
              <Link href="/signup">Get Started for Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8 py-6 text-lg">
              <Link href="/faqs">View FAQs</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

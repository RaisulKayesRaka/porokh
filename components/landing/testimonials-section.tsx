import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const testimonials = [
  {
    quote: "Porokh has completely transformed how we conduct mid-term exams. The AI grading feature alone saves our staff dozens of hours every month.",
    author: "Dr. Sarah Mitchell",
    role: "Dean of Computer Science",
    avatar: "SM",
  },
  {
    quote: "The security features are top-notch. I can finally feel confident about the integrity of our remote examinations.",
    author: "Prof. James Wilson",
    role: "University Lecturer",
    avatar: "JW",
  },
  {
    quote: "Student feedback has been incredibly positive. They love the clean interface and the instant feedback they get after submitting.",
    author: "Elena Rodriguez",
    role: "High School Principal",
    avatar: "ER",
  },
];

export function TestimonialsSection() {
  return (
    <section className="w-full py-20 bg-background border-b">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Trusted by Educators Everywhere</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Join thousands of institutions that have modernised their testing process with Porokh.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, index) => (
            <Card key={index} className="flex flex-col justify-between">
              <CardContent className="pt-6">
                <p className="text-lg italic text-muted-foreground mb-4">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{t.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-sm">{t.author}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

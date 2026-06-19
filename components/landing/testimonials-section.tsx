import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    quote:
      "Porokh cut our grading time by 80%. The AI understands our rubrics perfectly and the analytics help us identify performance gaps instantly.",
    name: "Sarah Mitchell",
    role: "Training Manager",
    initials: "SM",
  },
  {
    quote:
      "The proctoring features give me real confidence in remote certification exams. Tab-switch tracking and paste detection have been game-changers.",
    name: "James Wilson",
    role: "Certification Lead",
    initials: "JW",
  },
  {
    quote:
      "Setting up an assessment takes under a minute. Our candidates love the clean interface, and I love the detailed analytics after each exam.",
    name: "Elena Rodriguez",
    role: "HR Director",
    initials: "ER",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-muted/30 py-24 md:py-32">
      <div className="container mx-auto max-w-7xl px-6 md:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center md:mb-20">
          <p className="text-primary mb-4 text-sm font-semibold uppercase tracking-widest">
            Testimonials
          </p>
          <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Trusted by Professionals Worldwide
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed md:text-xl">
            See how Porokh is transforming assessment for teams around the
            globe.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-2xl border border-black/[0.08] bg-white/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/30  dark:border-white/[0.08] dark:bg-white/5 dark:hover:border-violet-400/20"
            >
              {/* Decorative Quote Mark */}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text font-serif text-4xl leading-none text-transparent dark:from-violet-400 dark:to-indigo-400">
                &ldquo;
              </span>

              {/* Quote */}
              <p className="text-foreground/80 mt-2 mb-6 text-base leading-relaxed italic md:text-lg">
                {testimonial.quote}
              </p>

              {/* Divider */}
              <div className="mb-4 h-px w-12 bg-gradient-to-r from-violet-500 to-indigo-500" />

              {/* Author */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-semibold text-white">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{testimonial.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

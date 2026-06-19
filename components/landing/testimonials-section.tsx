import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    quote:
      "Porokh cut our grading time by 80%. The AI understands our rubrics perfectly and the analytics help us identify performance gaps instantly.",
    name: "Sadia Rahman",
    role: "Training Manager at EdTech BD",
    initials: "SR",
  },
  {
    quote:
      "The proctoring features give me real confidence in remote certification exams. Tab-switch tracking and paste detection have been game-changers.",
    name: "Tariqul Islam",
    role: "Certification Lead",
    initials: "TI",
  },
  {
    quote:
      "Setting up an assessment takes under a minute. Our candidates love the clean interface, and I love the detailed analytics after each exam.",
    name: "Farhana Ahmed",
    role: "HR Director at TechCorp Dhaka",
    initials: "FA",
  },
  {
    quote:
      "Managing university entrance exams used to be a nightmare. Porokh's robust platform made our recent admission tests completely seamless and transparent.",
    name: "Dr. Anisur Rahman",
    role: "University Professor",
    initials: "AR",
  },
  {
    quote:
      "The AI-powered descriptive grading is astonishingly accurate. It saves our instructors countless hours while giving students detailed, personalized feedback.",
    name: "Nusrat Jahan",
    role: "Head of Operations",
    initials: "NJ",
  },
  {
    quote:
      "We've scaled our corporate training programs massively without adding extra administrative overhead. Porokh handles the assessment pipeline flawlessly.",
    name: "Kamrul Hasan",
    role: "Corporate Trainer",
    initials: "KH",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-muted/30 py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-6 md:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center md:mb-16">
          <p className="text-primary mb-4 text-sm font-semibold uppercase tracking-widest">
            Testimonials
          </p>
          <h2 className="mb-6 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Trusted by Professionals Worldwide
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed md:text-xl">
            See how Porokh is transforming assessment for teams around the globe.
          </p>
        </div>

        {/* Marquee Container */}
        <div 
          className="relative flex max-w-[100vw] overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
          }}
        >
          {/* Scrolling Tracks Container */}
          <div className="flex gap-6 hover:[&>div]:[animation-play-state:paused]">
            {/* Track 1 */}
            <div className="flex animate-marquee gap-6 shrink-0">
              {testimonials.map((testimonial, idx) => (
                <div
                  key={`t1-${idx}`}
                  className="flex flex-col w-[300px] sm:w-[350px] shrink-0 rounded-2xl border border-black/[0.08] bg-white/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/30 whitespace-normal dark:border-white/[0.08] dark:bg-white/5 dark:hover:border-violet-400/20"
                >
                  <span className="bg-gradient-to-r from-violet-600 to-violet-500 bg-clip-text font-serif text-4xl leading-none text-transparent dark:from-violet-400 dark:to-violet-300">
                    &ldquo;
                  </span>
                  <p className="text-foreground/80 mt-2 mb-6 text-base leading-relaxed italic flex-grow">
                    {testimonial.quote}
                  </p>
                  <div className="mt-auto">
                    <div className="mb-4 h-px w-12 bg-gradient-to-r from-violet-500 to-violet-400" />
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-violet-600 to-violet-500 text-sm font-semibold text-white">
                          {testimonial.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{testimonial.name}</p>
                        <p className="text-muted-foreground text-xs truncate">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Track 2 (Duplicate for Seamless Infinite Loop) */}
            <div className="flex animate-marquee gap-6 shrink-0" aria-hidden="true">
              {testimonials.map((testimonial, idx) => (
                <div
                  key={`t2-${idx}`}
                  className="flex flex-col w-[300px] sm:w-[350px] shrink-0 rounded-2xl border border-black/[0.08] bg-white/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/30 whitespace-normal dark:border-white/[0.08] dark:bg-white/5 dark:hover:border-violet-400/20"
                >
                  <span className="bg-gradient-to-r from-violet-600 to-violet-500 bg-clip-text font-serif text-4xl leading-none text-transparent dark:from-violet-400 dark:to-violet-300">
                    &ldquo;
                  </span>
                  <p className="text-foreground/80 mt-2 mb-6 text-base leading-relaxed italic flex-grow">
                    {testimonial.quote}
                  </p>
                  <div className="mt-auto">
                    <div className="mb-4 h-px w-12 bg-gradient-to-r from-violet-500 to-violet-400" />
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-violet-600 to-violet-500 text-sm font-semibold text-white">
                          {testimonial.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{testimonial.name}</p>
                        <p className="text-muted-foreground text-xs truncate">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

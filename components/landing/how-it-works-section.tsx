
const steps = [
  {
    number: "01",
    title: "Create a Room",
    description:
      "Set up your secure assessment space instantly and share the unique room code with your examinees.",
  },
  {
    number: "02",
    title: "Build Your Exam",
    description:
      "Use our rich text editor to craft multiple-choice and descriptive questions with full LaTeX math support.",
  },
  {
    number: "03",
    title: "Proctor & Monitor",
    description:
      "Launch exams with zero-trust security. Automatically track tab switches, detect pasting, and enforce strict time limits.",
  },
  {
    number: "04",
    title: "Grade with AI",
    description:
      "Let our advanced AI evaluate descriptive answers against your rubrics in seconds, and generate personalized feedback.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative bg-background py-16 md:py-24 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="mb-12 text-center md:mb-16">
          <p className="text-primary mb-4 text-sm font-semibold uppercase tracking-widest animate-fade-up">
            How It Works
          </p>
          <h2 className="mb-6 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl animate-fade-up" style={{ animationDelay: "100ms" }}>
            Get Started in Minutes
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed md:text-xl animate-fade-up" style={{ animationDelay: "200ms" }}>
            Four simple steps to transform your entire assessment workflow from creation to grading.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            return (
              <div
                key={step.number}
                className="group relative overflow-hidden rounded-3xl border border-black/[0.08] bg-white/60 p-8 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/30 dark:border-white/[0.08] dark:bg-white/5 dark:hover:border-violet-400/20"
              >
                {/* Step Number (Outlined & Color Changing) */}
                <div className="mb-6 select-none font-sans text-6xl font-bold text-foreground/20 dark:text-foreground/40 transition-colors duration-300 group-hover:text-violet-500 dark:group-hover:text-violet-400 [-webkit-text-fill-color:transparent] [-webkit-text-stroke:1.5px_currentColor]">
                  {step.number}
                </div>

                {/* Content */}
                <h3 className="mb-2 text-xl font-bold">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

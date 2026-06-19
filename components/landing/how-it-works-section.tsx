const steps = [
  {
    number: 1,
    title: "Create a Room",
    description:
      "Set up your assessment space and share the unique room code with your group.",
  },
  {
    number: 2,
    title: "Build Your Exam",
    description:
      "Use our rich editor to add MCQ and descriptive questions with LaTeX math support.",
  },
  {
    number: 3,
    title: "Proctor & Monitor",
    description:
      "Launch with built-in security — tab tracking, paste detection, and time limits.",
  },
  {
    number: 4,
    title: "Grade with AI",
    description:
      "Let AI evaluate answers against your rubrics, or review and adjust manually.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-background py-24 md:py-32">
      <div className="container mx-auto max-w-7xl px-6 md:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center md:mb-20">
          <p className="text-primary mb-4 text-sm font-semibold uppercase tracking-widest">
            How It Works
          </p>
          <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Get Started in Minutes
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed md:text-xl">
            Four simple steps to transform your assessment workflow.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-6">
          {steps.map((step, index) => (
            <div key={step.number} className="relative text-center">
              {/* Connecting Line (desktop only, between steps) */}
              {index < steps.length - 1 && (
                <div className="absolute top-5 left-[calc(50%+24px)] hidden h-px w-[calc(100%-48px)] bg-gradient-to-r from-violet-300 to-indigo-300 md:block dark:from-violet-800 dark:to-indigo-800" />
              )}

              {/* Step Number Circle */}
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-bold text-white  ">
                {step.number}
              </div>

              {/* Step Content */}
              <h3 className="mt-4 mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

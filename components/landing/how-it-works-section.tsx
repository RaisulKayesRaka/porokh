const steps = [
  {
    number: "01",
    title: "Create a Room",
    description: "Set up a dedicated space for your assessments and invite examinees using a unique room code.",
  },
  {
    number: "02",
    title: "Design Your Exam",
    description: "Use our intuitive builder to add multiple choice or descriptive questions and set time limits.",
  },
  {
    number: "03",
    title: "Start & Monitor",
    description: "Publish your exam and monitor examinee activity in real-time with built-in security features.",
  },
  {
    number: "04",
    title: "Grade & Analyze",
    description: "Let AI assist with grading and review detailed performance analytics for your entire group.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="w-full py-20 bg-background border-b">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Get your examination room up and running in just a few simple steps.
          </p>
        </div>
        <div className="grid gap-12 lg:grid-cols-4 md:grid-cols-2">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col">
              <div className="text-sm font-bold text-primary mb-4 bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
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

import {
  Sparkles,
  ShieldCheck,
  FileText,
  BarChart3,
  Users,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Grading",
    description:
      "Grade descriptive answers in seconds with AI that understands rubrics, context, and nuance.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Proctoring",
    description:
      "Monitor tab switches, detect paste events, and maintain exam integrity — automatically.",
  },
  {
    icon: FileText,
    title: "Rich Question Builder",
    description:
      "Craft questions with rich text, LaTeX math formulas, and embedded images.",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description:
      "Visualize performance with per-question insights, score distributions, and trend analysis.",
  },
  {
    icon: Users,
    title: "Room-Based Organization",
    description:
      "Create assessment rooms with unique codes, role-based access, and team collaboration.",
  },
  {
    icon: Clock,
    title: "Timed Assessments",
    description:
      "Set durations with auto-submission, live countdown timers, and deadline enforcement.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-muted/30 py-24 md:py-32">
      <div className="container mx-auto max-w-7xl px-6 md:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center md:mb-20">
          <p className="text-primary mb-4 text-sm font-semibold uppercase tracking-widest">
            Features
          </p>
          <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Everything You Need to Assess Smarter
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed md:text-xl">
            A comprehensive toolkit designed for anyone who needs to conduct
            reliable assessments.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-black/[0.08] bg-white/80 p-6 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-violet-500/30  dark:border-white/[0.08] dark:bg-white/5 dark:hover:border-violet-400/20"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 mb-2 text-lg font-semibold">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

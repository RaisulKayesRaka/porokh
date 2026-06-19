import {
  Sparkles,
  ShieldAlert,
  PencilRuler,
  ArrowRight,
  MonitorPlay,
  Type,
  ImageIcon,
  CheckCircle2,
  AlertCircle,
  Code
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-muted/30 py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-6 md:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center md:mb-16">
          <p className="text-primary mb-4 text-sm font-semibold uppercase tracking-widest">
            Capabilities
          </p>
          <h2 className="mb-6 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Everything You Need to Assess Smarter
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed md:text-xl">
            A comprehensive toolkit designed for anyone who needs to conduct
            reliable, scalable, and secure assessments.
          </p>
        </div>

        {/* Features Layout */}
        <div className="flex flex-col gap-20 md:gap-24">
          
          {/* Feature 1: AI Grading (Text Left, Mockup Right) */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-1 flex flex-col gap-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                AI-Powered Grading
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Grade descriptive answers in seconds. Our AI evaluates each submission against your custom rubrics, understanding context and nuance just like a human examiner, but infinitely faster.
              </p>
              <ul className="flex flex-col gap-3 mt-2">
                {["Granular rubric mapping", "Context-aware scoring", "Personalized feedback generation"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="order-2 relative w-full min-h-[300px] sm:min-h-[400px] lg:min-h-0 lg:aspect-[4/3] rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white/50 dark:bg-black/20 p-4 sm:p-8 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/5 to-transparent" />
              
              {/* Mockup UI */}
              <div className="relative z-10 w-full max-w-[320px] sm:max-w-md bg-background border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-4 sm:p-6 flex flex-col gap-4 shadow-sm">
                <div className="flex justify-between items-center border-b border-border/50 pb-3 sm:pb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider">Question 4</span>
                    <span className="text-sm sm:text-base font-semibold text-foreground">Explain the process of Osmosis.</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5 px-2 sm:px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 text-[10px] sm:text-xs font-bold animate-pulse">
                    <Sparkles className="h-3 w-3" /> AI Grading...
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] sm:text-xs font-semibold text-primary">Student Answer:</span>
                  <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed bg-muted/50 p-3 rounded-xl border border-black/[0.05] dark:border-white/[0.05]">
                    Osmosis is the movement of water molecules from a region of higher water concentration to a region of lower water concentration through a semi-permeable membrane.
                  </p>
                </div>
                
                {/* Real UI AI Rubric Match */}
                <div className="flex items-start gap-3 rounded-xl p-3 text-sm bg-green-500/10 border border-green-500/20">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-start sm:items-center justify-between gap-2">
                      <span className="font-medium text-xs sm:text-sm text-foreground">Mentions semi-permeable membrane</span>
                      <div className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold bg-primary text-primary-foreground">+2 / 2</div>
                    </div>
                    <p className="text-muted-foreground text-[10px] sm:text-xs leading-relaxed">
                      The student explicitly stated &quot;through a semi-permeable membrane&quot;, successfully matching the core criteria.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Proctoring (Mockup Left, Text Right) */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 md:order-1 relative w-full min-h-[300px] sm:min-h-[400px] lg:min-h-0 lg:aspect-[4/3] rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white/50 dark:bg-black/20 p-4 sm:p-8 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent" />
              
              {/* Mockup UI */}
              <div className="relative z-10 w-full max-w-[320px] sm:max-w-md bg-background border border-black/[0.08] dark:border-white/[0.08] rounded-2xl overflow-hidden flex flex-col shadow-sm">
                <div className="bg-muted/50 border-b border-border/50 p-3 sm:p-4 flex items-center gap-3">
                  <MonitorPlay className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <span className="font-semibold text-xs sm:text-sm">Live Proctoring Dashboard</span>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">32 Active</span>
                  </div>
                </div>
                <div className="flex flex-col divide-y divide-border/50">
                  <div className="p-3 sm:p-4 flex items-center justify-between bg-background">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-[10px] sm:text-xs">JS</div>
                      <span className="text-xs sm:text-sm font-medium">Jane Smith</span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-medium text-emerald-600 dark:text-emerald-400 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-emerald-50 dark:bg-emerald-950/50 rounded-full">Focus Active</span>
                  </div>
                  <div className="p-3 sm:p-4 flex items-center justify-between bg-violet-50/50 dark:bg-violet-950/10">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold text-[10px] sm:text-xs">MD</div>
                      <span className="text-xs sm:text-sm font-medium">Michael Doe</span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-violet-600 dark:text-violet-400 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-violet-100 dark:bg-violet-900/50 rounded-full animate-pulse flex items-center gap-1 sm:gap-1.5">
                      <AlertCircle className="h-3 w-3" /> Tab Switched
                    </span>
                  </div>
                  <div className="p-3 sm:p-4 flex items-center justify-between bg-background">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-[10px] sm:text-xs">AW</div>
                      <span className="text-xs sm:text-sm font-medium">Alice Wong</span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-medium text-emerald-600 dark:text-emerald-400 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-emerald-50 dark:bg-emerald-950/50 rounded-full">Focus Active</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2 flex flex-col gap-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Zero-Trust Proctoring
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Maintain complete exam integrity automatically. Our proctoring engine monitors user behavior in real-time and alerts you the second suspicious activity occurs.
              </p>
              <ul className="flex flex-col gap-3 mt-2">
                {["Tab switch detection", "Paste event monitoring", "Detailed activity logs"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Feature 3: Exam Builder (Text Left, Mockup Right) */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-1 flex flex-col gap-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                <PencilRuler className="h-6 w-6" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Rich Exam Builder
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Create sophisticated assessments with our intuitive editor. Support for rich text, complex mathematics, and mixed question types all in one place.
              </p>
              <ul className="flex flex-col gap-3 mt-2">
                {["Native LaTeX math rendering", "Multiple choice & descriptive", "Embedded media support"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="order-2 relative w-full min-h-[300px] sm:min-h-[400px] lg:min-h-0 lg:aspect-[4/3] rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white/50 dark:bg-black/20 p-4 sm:p-8 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-bl from-violet-500/5 to-transparent" />
              
              {/* Mockup UI */}
              <div className="relative z-10 w-full max-w-[320px] sm:max-w-md bg-background border border-black/[0.08] dark:border-white/[0.08] rounded-2xl flex flex-col overflow-hidden shadow-sm">
                {/* Editor Toolbar */}
                <div className="flex items-center gap-1 sm:gap-2 p-2 sm:p-3 bg-muted/50 border-b border-border/50">
                  <div className="p-1.5 rounded hover:bg-muted text-foreground/70"><Type className="h-3 w-3 sm:h-4 sm:w-4" /></div>
                  <div className="p-1.5 rounded hover:bg-muted text-foreground/70"><ImageIcon className="h-3 w-3 sm:h-4 sm:w-4" /></div>
                  <div className="p-1.5 rounded bg-muted border border-black/5 dark:border-white/5 shadow-sm text-foreground"><Code className="h-3 w-3 sm:h-4 sm:w-4" /></div>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">Saved</span>
                  </div>
                </div>
                {/* Editor Content */}
                <div className="p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
                  <div className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Question 1</div>
                  <div className="text-sm sm:text-base text-foreground">Is the following equation <strong>Euler&apos;s Identity</strong>?</div>
                  <div className="bg-muted/30 p-3 sm:p-4 rounded-xl border border-border/50 flex items-center justify-center text-lg sm:text-xl text-foreground font-serif">
                    <span className="italic">e</span>
                    <sup className="italic text-[10px] sm:text-xs">i&pi;</sup>
                    <span className="mx-2 font-sans">+</span>
                    <span className="font-sans">1</span>
                    <span className="mx-2 font-sans">=</span>
                    <span className="font-sans">0</span>
                  </div>
                  <div className="h-px bg-border/50 w-full my-1 sm:my-2" />
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full border border-border flex items-center justify-center shrink-0"><div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-primary" /></div>
                    <span className="text-xs sm:text-sm text-foreground">True</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full border border-border shrink-0" />
                    <span className="text-xs sm:text-sm text-foreground">False</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer CTA */}
        <div className="mt-32 flex justify-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="group px-8 py-6 text-base font-semibold border-black/[0.08] dark:border-white/[0.08] hover:bg-muted/50 hover:border-violet-500/30 dark:hover:border-violet-400/30"
          >
            <Link href="/features">
              Explore All Features
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

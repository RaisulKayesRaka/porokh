import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { 
  ShieldCheck, 
  Zap, 
  BarChart4, 
  LayoutTemplate, 
  Globe, 
  Heart, 
  Lightbulb, 
  Target,
  ArrowRight
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background w-full">
      {/* Header */}
      <section className="bg-gradient-to-b from-violet-50/50 to-background dark:from-violet-950/20 dark:to-background py-20 md:py-28">
        <div className="container mx-auto max-w-7xl px-6 md:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-primary mb-4 text-sm font-semibold uppercase tracking-widest">
              OUR STORY
            </p>
            <h1 className="text-foreground mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Empowering Evaluations Through <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500 dark:from-violet-400 dark:via-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent">Intelligent Innovation</span>
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl leading-relaxed">
              Porokh is more than just a testing platform. We are a team dedicated to 
              redefining how knowledge is assessed in the digital age.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="w-full py-24 border-b border-border/50">
        <div className="container mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400 mb-2">
                <Target className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To provide organizations and individuals with a secure, intuitive, and AI-powered 
                ecosystem that streamlines the examination process. We strive to reduce 
                administrative burden while increasing the depth and quality of evaluation.
              </p>
              <div className="pt-4">
                <Separator className="mb-6 bg-border/50" />
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-3xl bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">100%</h4>
                    <p className="text-sm text-muted-foreground mt-1">Secure Testing</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-3xl bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">24/7</h4>
                    <p className="text-sm text-muted-foreground mt-1">Global Support</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-black/[0.08] bg-white/80 p-12 backdrop-blur-xl text-center space-y-4 h-full flex flex-col justify-center dark:border-white/[0.08] dark:bg-white/5">
              <Lightbulb className="h-16 w-16 text-violet-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold">The Vision</h3>
              <p className="text-muted-foreground italic leading-relaxed text-lg">
                &ldquo;A world where every examinee is evaluated fairly, every examiner is 
                empowered by technology, and integrity is the foundation 
                of every digital assessment.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="w-full py-24 bg-muted/30 border-b border-border/50">
        <div className="container mx-auto max-w-7xl px-6 md:px-8">
          <div className="text-center mb-16">
            <p className="text-violet-600 dark:text-violet-400 mb-4 text-sm font-semibold uppercase tracking-widest">Values</p>
            <h2 className="text-3xl font-bold tracking-tight mb-4 sm:text-4xl lg:text-5xl">The Values That Drive Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Our principles are embedded in every line of code we write and every feature we design.
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-black/[0.08] bg-white/80 p-8 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/30  dark:border-white/[0.08] dark:bg-white/5 dark:hover:border-violet-400/20 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-xl">Examinee Centric</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We design with the examinee experience in mind, ensuring clarity, 
                fairness, and reduced anxiety during high-stakes assessments.
              </p>
            </div>
            <div className="rounded-2xl border border-black/[0.08] bg-white/80 p-8 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/30  dark:border-white/[0.08] dark:bg-white/5 dark:hover:border-violet-400/20 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-xl">Accessible Everywhere</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our platform is built to work seamlessly across different devices 
                and internet speeds, ensuring no participant is left behind.
              </p>
            </div>
            <div className="rounded-2xl border border-black/[0.08] bg-white/80 p-8 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/30  dark:border-white/[0.08] dark:bg-white/5 dark:hover:border-violet-400/20 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-xl">Uncompromising Integrity</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Security isn't an afterthought; it's our foundation. We employ 
                state-of-the-art measures to protect assessment honesty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Porokh Difference */}
      <section className="w-full py-24 border-b border-border/50">
        <div className="container mx-auto max-w-7xl px-6 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4 sm:text-4xl">The Porokh Difference</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Why organizations choose our platform for their digital transformation.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-black/[0.08] bg-white/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/30  dark:border-white/[0.08] dark:bg-white/5 dark:hover:border-violet-400/20 flex flex-col h-full">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400 mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Secure Infrastructure</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                Military-grade data protection and real-time proctoring features that 
                deter assessment dishonesty before it happens.
              </p>
            </div>
            
            <div className="rounded-2xl border border-black/[0.08] bg-white/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/30  dark:border-white/[0.08] dark:bg-white/5 dark:hover:border-violet-400/20 flex flex-col h-full">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400 mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">AI Assistance</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                Our advanced AI doesn't just grade; it provides insightful feedback 
                that helps examinees learn and grow from every attempt.
              </p>
            </div>

            <div className="rounded-2xl border border-black/[0.08] bg-white/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/30  dark:border-white/[0.08] dark:bg-white/5 dark:hover:border-violet-400/20 flex flex-col h-full">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400 mb-4">
                <BarChart4 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Deep Analytics</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                Transform raw data into actionable insights with visual reports 
                that identify knowledge gaps across your entire cohort.
              </p>
            </div>

            <div className="rounded-2xl border border-black/[0.08] bg-white/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/30  dark:border-white/[0.08] dark:bg-white/5 dark:hover:border-violet-400/20 flex flex-col h-full">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400 mb-4">
                <LayoutTemplate className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Adaptive Builder</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                From simple quizzes to complex engineering exams with LaTeX, 
                our flexible builder adapts to your assessment needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden w-full py-24 bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-700 dark:from-violet-800 dark:via-indigo-800 dark:to-violet-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[size:20px_20px]" />
        <div className="container relative z-10 mx-auto max-w-7xl px-6 md:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">Join the Future of Evaluation</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70 mb-10">
            Experience the most intuitive, secure, and intelligent examination 
            platform available today. Let's modernize your assessments together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Button asChild size="lg" className="bg-white text-violet-700 hover:bg-white/90   font-semibold px-8">
              <Link href="/signup">
                Create Free Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 bg-transparent">
              <Link href="/features">Explore Features</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

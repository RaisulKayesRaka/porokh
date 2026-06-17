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
  Target 
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background w-full">
      {/* Hero Section */}
      <section className="w-full py-20 border-b">
        <div className="container mx-auto max-w-7xl px-4 md:px-8 text-center">
          <Badge variant="secondary" className="mb-6 rounded-full px-4 py-1">
            Our Story
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl mx-auto">
            Empowering Evaluations Through <br className="hidden md:block" />
            Intelligent Innovation
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Porokh is more than just a testing platform. We are a team dedicated to 
            redefining how knowledge is assessed in the digital age.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="w-full py-20 border-b">
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
                <Target className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To provide organizations and individuals with a secure, intuitive, and AI-powered 
                ecosystem that streamlines the examination process. We strive to reduce 
                administrative burden while increasing the depth and quality of evaluation.
              </p>
              <div className="pt-4">
                <Separator className="mb-6" />
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-2xl">100%</h4>
                    <p className="text-sm text-muted-foreground">Secure Testing</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-2xl">24/7</h4>
                    <p className="text-sm text-muted-foreground">Global Support</p>
                  </div>
                </div>
              </div>
            </div>
            <Card className="p-12 text-center space-y-4 h-full flex flex-col justify-center">
              <Lightbulb className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold">The Vision</h3>
              <p className="text-muted-foreground italic">
                &ldquo;A world where every examinee is evaluated fairly, every examiner is 
                empowered by technology, and integrity is the foundation 
                of every digital assessment.&rdquo;
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="w-full py-20 border-b">
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">The Values That Drive Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our principles are embedded in every line of code we write and every feature we design.
            </p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-3">
            <Card className="p-8 space-y-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Heart className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-xl">Examinee Centric</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We design with the examinee experience in mind, ensuring clarity, 
                fairness, and reduced anxiety during high-stakes assessments.
              </p>
            </Card>
            <Card className="p-8 space-y-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-xl">Accessible Everywhere</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our platform is built to work seamlessly across different devices 
                and internet speeds, ensuring no participant is left behind.
              </p>
            </Card>
            <Card className="p-8 space-y-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-xl">Uncompromising Integrity</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Security isn't an afterthought; it's our foundation. We employ 
                state-of-the-art measures to protect assessment honesty.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* The Porokh Difference */}
      <section className="w-full py-20 border-b">
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">The Porokh Difference</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Why organizations choose our platform for their digital transformation.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="flex flex-col h-full transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg font-bold">Secure Infrastructure</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Military-grade data protection and real-time proctoring features that 
                  deter assessment dishonesty before it happens.
                </p>
              </CardContent>
            </Card>
            
            <Card className="flex flex-col h-full transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg font-bold">AI Assistance</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our advanced AI doesn't just grade; it provides insightful feedback 
                  that helps examinees learn and grow from every attempt.
                </p>
              </CardContent>
            </Card>

            <Card className="flex flex-col h-full transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <BarChart4 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg font-bold">Deep Analytics</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Transform raw data into actionable insights with visual reports 
                  that identify knowledge gaps across your entire cohort.
                </p>
              </CardContent>
            </Card>

            <Card className="flex flex-col h-full transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <LayoutTemplate className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg font-bold">Adaptive Builder</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  From simple quizzes to complex engineering exams with LaTeX, 
                  our flexible builder adapts to your assessment needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full py-20 bg-background">
        <div className="container mx-auto max-w-7xl px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the Future of Evaluation</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
            Experience the most intuitive, secure, and intelligent examination 
            platform available today. Let's modernize your assessments together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8 py-6 text-lg">
              <Link href="/signup">Create Free Account</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8 py-6 text-lg">
              <Link href="/features">Explore Features</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

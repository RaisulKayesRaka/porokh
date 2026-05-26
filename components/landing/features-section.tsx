import { CheckCircle2, Shield, Zap, BarChart3, Users, Layout } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Secure Environment",
    description: "Built-in tab-switching detection and copy-paste restrictions to ensure exam integrity.",
    icon: Shield,
  },
  {
    title: "AI-Powered Grading",
    description: "Automate the grading of descriptive answers with advanced AI, saving hours of manual work.",
    icon: Zap,
  },
  {
    title: "Real-time Monitoring",
    description: "Keep track of student progress and behavior in real-time while the exam is in progress.",
    icon: Users,
  },
  {
    title: "Advanced Analytics",
    description: "Get deep insights into student performance with automated charts and performance reports.",
    icon: BarChart3,
  },
  {
    title: "Custom Question Builder",
    description: "Create multiple choice, descriptive, and interactive questions with ease.",
    icon: Layout,
  },
  {
    title: "Instant Feedback",
    description: "Provide students with immediate results and detailed feedback upon exam completion.",
    icon: CheckCircle2,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="w-full py-20 bg-background border-b">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Powerful Features for Modern Education</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Everything you need to conduct secure, efficient, and insightful examinations in one unified platform.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-2">
                  <feature.icon className="text-primary h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <div className="w-full bg-background relative overflow-hidden pt-20 pb-16 md:pt-[120px] md:pb-[100px] border-b">
      <div className="container relative z-10 mx-auto flex max-w-7xl flex-col items-center px-4 text-center md:px-8">
        {/* Badge */}
        <Badge
          variant="secondary"
          className="mb-6 rounded-full px-4 py-1 text-sm font-medium"
        >
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
              <span className="bg-primary relative inline-flex h-2 w-2 rounded-full"></span>
            </span>
            Introducing Porokh v1.0
          </span>
        </Badge>

        {/* Headline */}
        <h1 className="text-foreground mb-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          The Modern Way to Conduct <br className="hidden md:block" />
          Examinations
        </h1>

        {/* Subheadline */}
        <p className="text-muted-foreground mt-4 mb-10 max-w-2xl text-lg leading-relaxed md:text-xl">
          Streamline your testing process with our secure, intuitive, and highly
          scalable examination platform. Built for the modern organization.
        </p>

        {/* Calls to Action */}
        <div className="flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row sm:items-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/login">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/features">View Features</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

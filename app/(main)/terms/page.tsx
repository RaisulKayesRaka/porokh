import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Terms of Service | Porokh",
  description: "The terms and conditions for using the Porokh examination platform.",
};

export default function TermsOfServicePage() {
  const lastUpdated = "June 17, 2026";

  return (
    <div className="bg-background w-full">
      <div className="container mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        {/* Header Section */}
        <div className="mx-auto mb-14 max-w-2xl text-center md:mb-16">
          <Badge variant="secondary" className="mb-6 rounded-full px-4 py-1">
            Legal
          </Badge>
          <h1 className="text-foreground mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Terms of Service
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Content Section */}
        <Card className="max-w-7xl mx-auto">
          <CardContent className="p-8 md:p-12">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <div className="space-y-12">
                <div>
                  <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    By accessing or using Porokh, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Permission is granted to temporarily use the services provided by Porokh for personal or institutional educational purposes. This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Attempt to decompile or reverse engineer any software contained on Porokh's website.</li>
                    <li>Remove any copyright or other proprietary notations from the materials.</li>
                    <li>Use the platform for any illegal purpose or to violate any laws in your jurisdiction.</li>
                    <li>Attempt to bypass any security measures or proctoring features of the platform.</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-bold mb-4">4. Content and Academic Integrity</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Users are solely responsible for the content they upload to the platform. Porokh provides tools for academic assessment but does not guarantee the accuracy or quality of user-generated exam content. We support academic integrity and reserve the right to terminate accounts involved in systematic cheating or platform abuse.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-bold mb-4">5. Disclaimer</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    The materials on Porokh's website are provided on an 'as is' basis. Porokh makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-bold mb-4">6. Limitations</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    In no event shall Porokh or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Porokh's website.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have any questions about these Terms, please contact us at terms@porokh.app.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

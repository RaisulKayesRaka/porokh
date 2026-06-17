import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Privacy Policy | Porokh",
  description: "Learn how we collect, use, and protect your personal information at Porokh.",
};

export default function PrivacyPolicyPage() {
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
            Privacy Policy
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
                  <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Welcome to Porokh (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our examination platform.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Personal Data</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We collect personal information that you voluntarily provide to us when you register on the platform, express an interest in obtaining information about us or our products, or otherwise when you contact us. This may include:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                      <li>Name and contact data (Email address, name).</li>
                      <li>Credentials (Passwords and similar security information used for authentication).</li>
                      <li>Profile information (Profile picture, institutional affiliation).</li>
                    </ul>
                    
                    <h3 className="text-xl font-semibold mt-6">Examination Data</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      As an examination platform, we process data related to tests, including:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                      <li>Exam content (questions, answers, media).</li>
                      <li>Student submissions and results.</li>
                      <li>Grading data and AI-generated feedback.</li>
                    </ul>
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We use personal information collected via our platform for a variety of business purposes, including:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>To facilitate account creation and logon process.</li>
                    <li>To enable user-to-user communication (e.g., room invites).</li>
                    <li>To provide and deliver the examination services you request.</li>
                    <li>To improve our platform and user experience through analytics.</li>
                    <li>To provide AI-powered grading assistance and insights.</li>
                    <li>To respond to user inquiries and offer support.</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal information to and from our platform is at your own risk.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-bold mb-4">5. Your Privacy Rights</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, or delete your data. You can manage most of your personal information directly through your account settings.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-2xl font-bold mb-4">6. Contact Us</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have questions or comments about this policy, you may email us at privacy@porokh.app or contact our support team through the platform.
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

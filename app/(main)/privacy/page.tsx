import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how we collect, use, and protect your personal information at Porokh.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "June 17, 2026";

  return (
    <div className="bg-background w-full min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-b from-violet-50/50 to-background dark:from-violet-950/20 dark:to-background py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-6 md:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-primary mb-4 text-sm font-semibold uppercase tracking-widest">
              LEGAL
            </p>
            <h1 className="text-foreground mb-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl leading-relaxed">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-24">
        <div className="rounded-2xl border border-black/[0.08] bg-white/80 p-8 md:p-12 backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/5">
          <div className="mx-auto max-w-4xl">
            <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-violet-600 dark:prose-a:text-violet-400">
              <div className="space-y-12">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Welcome to Porokh (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our examination platform.
                  </p>
                </div>

                <div className="h-px bg-border/50" />

                <div>
                  <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Personal Data</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We collect personal information that you voluntarily provide to us when you register on the platform, express an interest in obtaining information about us or our products, or otherwise when you contact us. This may include:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                      <li>Name and contact data (Email address, name).</li>
                      <li>Credentials (Passwords and similar security information used for authentication).</li>
                      <li>Profile information (Profile picture, organization affiliation).</li>
                    </ul>
                    
                    <h3 className="text-xl font-semibold mt-6">Examination Data</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      As an examination platform, we process data related to tests, including:
                    </p>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                      <li>Exam content (questions, answers, media).</li>
                      <li>Examinee submissions and results.</li>
                      <li>Grading data and AI-generated feedback.</li>
                    </ul>
                  </div>
                </div>

                <div className="h-px bg-border/50" />

                <div>
                  <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
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

                <div className="h-px bg-border/50" />

                <div>
                  <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal information to and from our platform is at your own risk.
                  </p>
                </div>

                <div className="h-px bg-border/50" />

                <div>
                  <h2 className="text-2xl font-semibold mb-4">5. Your Privacy Rights</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, or delete your data. You can manage most of your personal information directly through your account settings.
                  </p>
                </div>

                <div className="h-px bg-border/50" />

                <div>
                  <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have questions or comments about this policy, you may email us at <a href="mailto:privacy@porokh.vercel.app">privacy@porokh.vercel.app</a> or contact our support team through the platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

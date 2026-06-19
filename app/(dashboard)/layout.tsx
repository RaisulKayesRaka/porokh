"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  if (isPending) return null;
  if (!session?.user) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex flex-1 flex-col relative bg-gradient-to-b from-violet-50/50 to-background dark:from-violet-950/20 dark:to-background">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,_rgba(124,58,237,0.08)_1px,_transparent_1px)] dark:bg-[radial-gradient(circle,_rgba(139,92,246,0.04)_1px,_transparent_1px)] bg-[size:24px_24px]" />
          <div className="relative z-10 flex flex-1 flex-col h-full w-full">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

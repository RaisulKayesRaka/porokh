"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useSession } from "@/lib/auth-client";

export function NavBar() {
  const { data: session } = useSession();

  return (
    <nav className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-7xl items-center px-4 md:px-8">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-8 flex items-center space-x-2">
            <Image
              src="/porokh.svg"
              alt="Porokh Logo"
              width={24}
              height={24}
              className="invert dark:invert-0"
            />
            <span className="text-2xl font-bold tracking-tight">Porokh</span>
          </Link>
          <div className="hidden items-center gap-2 text-sm font-medium md:flex">
            <Button asChild variant="ghost" className="text-foreground">
              <Link href="/">Home</Link>
            </Button>
            <Button asChild variant="ghost" className="text-foreground/60 hover:text-foreground">
              <Link href="/features">Features</Link>
            </Button>
            <Button asChild variant="ghost" className="text-foreground/60 hover:text-foreground">
              <Link href="/faqs">FAQs</Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ModeToggle />
            {session ? (
              <Button asChild variant="outline">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </nav>
  );
}

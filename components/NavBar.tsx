"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import { useSession, signOut } from "@/lib/auth-client";
import { Menu, LayoutDashboard, User, LogOut } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavBar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
  };

  const routes = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "About", href: "/about" },
    { name: "FAQs", href: "/faqs" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full h-16 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto flex h-full max-w-7xl items-center px-6 md:px-8">
        {/* Logo */}
        <div className="flex flex-1 items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/porokh.svg"
              alt="Porokh Logo"
              width={26}
              height={26}
              className="transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-xl font-bold tracking-tight">Porokh</span>
          </Link>
        </div>

        {/* Desktop Navigation — Centered */}
        <div className="hidden flex-1 items-center justify-center gap-6 md:flex">
          {routes.map((route) => {
            const isActive = pathname === route.href;
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm transition-colors",
                  isActive
                    ? "text-primary font-semibold hover:text-primary"
                    : "text-muted-foreground hover:text-foreground font-medium"
                )}
              >
                {route.name}
              </Link>
            );
          })}
        </div>

        {/* Right Side: Auth */}
        <div className="flex flex-1 items-center justify-end gap-2 md:gap-3">
          {session ? (
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-9 w-9 ring-2 ring-violet-500/20  hover:ring-violet-500/40">
                      <AvatarImage
                        src={session.user.image ?? ""}
                        alt={session.user.name}
                      />
                      <AvatarFallback className="bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300 text-sm font-semibold">
                        {session.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Account</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button
                asChild
                variant="ghost"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                asChild
                className="bg-violet-600 hover:bg-violet-700 text-white    transition-all duration-300"
              >
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[360px] border-l border-border/50 bg-background/95 backdrop-blur-xl"
              >
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-8 py-8 px-2 h-full">
                  {/* Nav Links */}
                  <div className="flex flex-col">
                    {routes.map((route) => {
                      const isActive = pathname === route.href;
                      return (
                        <Link
                          key={route.href}
                          href={route.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "px-4 py-4 text-lg transition-colors border-b border-border/50 last:border-0",
                            isActive
                              ? "text-primary font-bold"
                              : "text-muted-foreground hover:text-foreground font-medium"
                          )}
                        >
                          {route.name}
                        </Link>
                      );
                    })}
                  </div>

                  <div className="mt-auto">
                    {/* Auth Section */}
                    {session ? (
                      <div className="flex flex-col border-t border-border/50 pt-6 gap-2">
                        {/* User Info */}
                        <div className="flex items-center gap-3 px-4 py-2 mb-4">
                          <Avatar className="h-10 w-10 ring-2 ring-violet-500/20">
                            <AvatarImage
                              src={session.user.image ?? ""}
                              alt={session.user.name}
                            />
                            <AvatarFallback className="bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300 text-sm font-semibold">
                              {session.user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{session.user.name}</span>
                            <span className="text-xs text-muted-foreground">{session.user.email}</span>
                          </div>
                        </div>
                        <Link
                          href="/dashboard"
                          onClick={() => setOpen(false)}
                          className="text-muted-foreground hover:text-foreground px-4 py-3 text-base font-medium transition-colors flex items-center gap-3 border-b border-border/50"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                        <Link
                          href="/account"
                          onClick={() => setOpen(false)}
                          className="text-muted-foreground hover:text-foreground px-4 py-3 text-base font-medium transition-colors flex items-center gap-3 border-b border-border/50"
                        >
                          <User className="h-4 w-4" />
                          Account
                        </Link>
                        <button
                          onClick={() => {
                            handleSignOut();
                            setOpen(false);
                          }}
                          className="text-destructive hover:text-destructive/80 px-4 py-3 text-left text-base font-medium transition-colors flex items-center gap-3 mt-2"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Log out</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 pt-6 border-t border-border/50 px-2">
                        <Button
                          asChild
                          variant="outline"
                          className="w-full justify-center transition-colors"
                        >
                          <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
                        </Button>
                        <Button
                          asChild
                          className="w-full justify-center bg-violet-600 hover:bg-violet-700 text-white transition-all duration-300"
                        >
                          <Link href="/signup" onClick={() => setOpen(false)}>Sign Up</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

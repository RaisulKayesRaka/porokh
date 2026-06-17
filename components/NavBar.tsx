"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
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
import { useRouter } from "next/navigation";

export function NavBar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
  };

  const routes = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "FAQs", href: "/faqs" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-7xl items-center px-4 md:px-8">
        <div className="flex flex-1 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/porokh.svg"
              alt="Porokh Logo"
              width={24}
              height={24}
              className="invert dark:invert-0"
            />
            <span className="text-2xl font-bold tracking-tight">Porokh</span>
          </Link>
        </div>

        <div className="hidden flex-1 items-center justify-center gap-2 text-sm font-medium md:flex">
          {routes.map((route) => (
            <Button
              key={route.href}
              asChild
              variant="ghost"
              className={
                route.name === "Home"
                  ? "text-foreground"
                  : "text-foreground/60 hover:text-foreground"
              }
            >
              <Link href={route.href}>{route.name}</Link>
            </Button>
          ))}
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-4">
          <nav className="flex items-center space-x-2">
            <ModeToggle />
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user.image ?? ""}
                        alt={session.user.name}
                      />
                      <AvatarFallback>
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
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Button asChild variant="outline">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
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
                  className="w-[280px] sm:w-[350px] pr-0"
                >
                  <SheetHeader className="sr-only">
                    <SheetTitle>Navigation Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-4 py-8 px-7">
                    <div className="flex flex-col gap-3">
                      {routes.map((route) => (
                        <Link
                          key={route.href}
                          href={route.href}
                          onClick={() => setOpen(false)}
                          className="text-foreground/60 hover:text-foreground text-base font-medium transition-colors"
                        >
                          {route.name}
                        </Link>
                      ))}
                    </div>
                    <div className="border-t pt-4 flex flex-col gap-3">
                      {session ? (
                        <>
                          <Link
                            href="/dashboard"
                            onClick={() => setOpen(false)}
                            className="text-foreground/60 hover:text-foreground text-base font-medium transition-colors flex items-center"
                          >
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                          <Link
                            href="/account"
                            onClick={() => setOpen(false)}
                            className="text-foreground/60 hover:text-foreground text-base font-medium transition-colors flex items-center"
                          >
                            <User className="mr-2 h-4 w-4" />
                            Account
                          </Link>
                          <button
                            onClick={() => {
                              handleSignOut();
                              setOpen(false);
                            }}
                            className="text-destructive hover:text-destructive/80 text-left text-base font-medium transition-colors flex items-center"
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/login"
                            onClick={() => setOpen(false)}
                            className="text-foreground/60 hover:text-foreground text-base font-medium transition-colors"
                          >
                            Login
                          </Link>
                          <Link
                            href="/signup"
                            onClick={() => setOpen(false)}
                            className="text-foreground/60 hover:text-foreground text-base font-medium transition-colors"
                          >
                            Sign Up
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </div>
      </div>
    </nav>
  );
}

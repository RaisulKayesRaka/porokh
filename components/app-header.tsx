"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  title?: string;
  children?: React.ReactNode;
  showBreadcrumbs?: boolean;
}

export function AppHeader({ title, children, showBreadcrumbs = false }: AppHeaderProps) {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname
  const pathSegments = pathname.split("/").filter(Boolean);
  
  // Custom label mapping for common path segments
  const labelMap: Record<string, string> = {
    dashboard: "Dashboard",
    rooms: "Rooms",
    exams: "Exams",
    members: "Members",
    settings: "Settings",
    analytics: "Analytics",
    results: "Results",
    submissions: "Submissions",
    new: "New",
    edit: "Edit",
    attempt: "Take Exam",
  };

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const label = labelMap[segment] || segment;
    const isLast = index === pathSegments.length - 1;

    // Skip UUID-like segments in labels if we have a title, otherwise use the fragment
    // In this app, room/exam IDs are UUIDs or similar. 
    // We try to use the 'title' prop for the last segment if it's dynamic.
    const displayLabel = (isLast && title) ? title : label;

    return { href, label: displayLabel, isLast };
  });

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b px-4 backdrop-blur transition-all">
      <div className="flex flex-1 items-center gap-2 overflow-hidden">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-1.5 h-4 !self-center" />
        
        {showBreadcrumbs ? (
          <nav className="flex items-center gap-1.5 overflow-hidden text-sm font-medium">
            <Link 
              href="/dashboard" 
              className="text-muted-foreground hover:text-foreground hidden sm:block shrink-0 transition-colors"
            >
              <Home className="h-4 w-4" />
            </Link>
            
            {breadcrumbs.length > 0 && <ChevronRight className="text-muted-foreground hidden h-4 w-4 sm:block shrink-0" />}
            
            {breadcrumbs.map((crumb) => (
              <React.Fragment key={crumb.href}>
                <Link
                  href={crumb.href}
                  className={cn(
                    "truncate transition-colors",
                    crumb.isLast 
                      ? "text-foreground font-bold" 
                      : "text-muted-foreground hover:text-foreground hidden md:block"
                  )}
                >
                  {crumb.label}
                </Link>
                {!crumb.isLast && (
                  <ChevronRight className="text-muted-foreground hidden h-4 w-4 md:block shrink-0" />
                )}
              </React.Fragment>
            ))}
          </nav>
        ) : (
          <h1 className="text-xl font-bold tracking-tight truncate">
            {title}
          </h1>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        {children}
        <ModeToggle />
      </div>
    </header>
  );
}

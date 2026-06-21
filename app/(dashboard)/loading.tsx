import { Loader2Icon } from "lucide-react";
import { AppHeader } from "@/components/app-header";

export default function DashboardLoading() {
  return (
    <div className="flex w-full flex-col h-full">
      <AppHeader title="Loading..." />
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2Icon className="h-8 w-8 animate-spin text-violet-500" />
          <p className="text-sm font-medium animate-pulse">Loading content...</p>
        </div>
      </div>
    </div>
  );
}

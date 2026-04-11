"use client";

import { useRouter } from "next/navigation";
import { Button, ButtonProps } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

interface RefreshButtonProps extends ButtonProps {
  label?: string;
  iconOnly?: boolean;
}

export function RefreshButton({ 
  label = "Refresh", 
  iconOnly = false, 
  className, 
  ...props 
}: RefreshButtonProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <Button onClick={handleRefresh} disabled={isRefreshing} className={className} {...props}>
      <RefreshCw className={`${iconOnly ? "" : "mr-2 "}h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
      {!iconOnly && <span className="hidden sm:inline">{label}</span>}
    </Button>
  );
}

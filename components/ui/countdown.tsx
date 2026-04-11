"use client";

import { useState, useEffect } from "react";
import { differenceInSeconds } from "date-fns";
import { Clock, LucideIcon } from "lucide-react";

interface CountdownProps {
  targetDate: Date | string;
  prefix?: string;
  className?: string;
  iconClassName?: string;
  icon?: LucideIcon;
  onComplete?: () => void;
}

export function Countdown({
  targetDate,
  prefix,
  className = "",
  iconClassName = "h-4 w-4 shrink-0",
  icon: Icon = Clock,
  onComplete,
}: CountdownProps) {
  const [timeLeftStr, setTimeLeftStr] = useState<string | null>(null);

  useEffect(() => {
    const target = new Date(targetDate);

    const updateTimer = () => {
      const remainingSeconds = Math.max(
        differenceInSeconds(target, new Date()),
        0,
      );

      if (remainingSeconds === 0) {
        if (onComplete) onComplete();
        setTimeLeftStr(null);
        return;
      }

      const d = Math.floor(remainingSeconds / (3600 * 24));
      const h = Math.floor((remainingSeconds % (3600 * 24)) / 3600);
      const m = Math.floor((remainingSeconds % 3600) / 60);
      const s = remainingSeconds % 60;

      let timeString = "";

      if (d > 0) {
        timeString = `${d}d ${h}h ${m}m`;
      } else if (h > 0) {
        timeString = `${h}h ${m}m ${s}s`;
      } else {
        timeString = `${m}m ${s}s`;
      }

      setTimeLeftStr(timeString);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  if (!timeLeftStr) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Icon className={iconClassName} />
      <span>{prefix ? `${prefix} ${timeLeftStr}` : timeLeftStr}</span>
    </div>
  );
}

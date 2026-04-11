"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

type RoomSettingsNavbarProps = {
  roomId: string;
  isExaminer: boolean;
};

export function RoomSettingsNavbar({
  roomId,
  isExaminer,
}: RoomSettingsNavbarProps) {
  if (!isExaminer) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-foreground h-8 w-8"
        asChild
      >
        <Link href={`/rooms/${roomId}/settings`}>
          <Settings className="h-5 w-5" />
          <span className="sr-only">Room Settings</span>
        </Link>
      </Button>
    </div>
  );
}

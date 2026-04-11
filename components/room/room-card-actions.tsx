"use client";

import { useState } from "react";
import { Copy, LogOut, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { leaveRoom } from "@/app/actions/member";
import { useRouter } from "next/navigation";

interface RoomCardActionsProps {
  roomId: string;
  roomCode: string;
  isOwner: boolean;
  isExaminer: boolean;
}

export function RoomCardActions({
  roomId,
  roomCode,
  isOwner,
  isExaminer,
}: RoomCardActionsProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const canCopyCode = isOwner || isExaminer;
  const canLeave = !isOwner;

  const handleCopyCode = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(roomCode);
      toast.success("Room code copied to clipboard!");
    } catch {
      toast.error("Failed to copy room code.");
    }
  };

  const handleLeave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsPending(true);
    const res = await leaveRoom(roomId);
    if (res.error) {
      toast.error(res.error);
      setIsPending(false);
    } else {
      toast.success("You have left the room.");
      router.refresh(); // Refresh the rooms dashboard
    }
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (!canCopyCode && !canLeave) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground h-8 w-8"
          onClick={handleTriggerClick}
        >
          <MoreVertical/>
          <span className="sr-only">Open room options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto" onClick={(e) => e.stopPropagation()}>
        {canCopyCode && (
          <DropdownMenuItem onClick={handleCopyCode}>
            <Copy/>
            <span>Copy Room Code</span>
          </DropdownMenuItem>
        )}
        {canLeave && (
          <DropdownMenuItem
            disabled={isPending}
            onClick={handleLeave}
            className="text-destructive focus:text-destructive"
          >
            <LogOut/>
            <span>Leave Room</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

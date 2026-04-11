"use client";

import { useState } from "react";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { resetRoomCode } from "@/app/actions/room";

interface ResetRoomCodeButtonProps {
  roomId: string;
}

export function ResetRoomCodeButton({ roomId }: ResetRoomCodeButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const handleReset = async () => {
    setIsPending(true);
    const res = await resetRoomCode(roomId);
    
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Room code reset successfully.");
    }
    
    setIsPending(false);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-muted-foreground hover:text-foreground"
      onClick={handleReset}
      disabled={isPending}
      title="Reset Room Code"
    >
      <RefreshCcw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
      <span className="sr-only">Reset Room Code</span>
    </Button>
  );
}

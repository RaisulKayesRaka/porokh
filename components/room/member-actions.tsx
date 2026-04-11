"use client";

import { useState } from "react";
import { UserMinus, ShieldAlert, LogOut } from "lucide-react";
import { toast } from "sonner";
import {
  removeMember,
  transferOwnership,
  leaveRoom,
} from "@/app/actions/member";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface MemberActionsProps {
  roomId: string;
  targetUserId: string;
  targetRole: "EXAMINER" | "EXAMINEE";
  isViewerOwner: boolean;
  isViewerExaminer: boolean;
  isSelf: boolean;
}

export function MemberActions({
  roomId,
  targetUserId,
  targetRole,
  isViewerOwner,
  isViewerExaminer,
  isSelf,
}: MemberActionsProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const canRemove =
    (isViewerOwner && !isSelf) ||
    (isViewerExaminer &&
      !isViewerOwner &&
      targetRole === "EXAMINEE" &&
      !isSelf);
  const canTransferOwnership =
    isViewerOwner && targetRole === "EXAMINER" && !isSelf;
  const canLeaveRoom = isSelf && !isViewerOwner;

  const handleRemove = async () => {
    setIsPending(true);
    const res = await removeMember(roomId, targetUserId);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("User removed from the room.");
    }
    setIsPending(false);
  };

  const handleTransfer = async () => {
    setIsPending(true);
    const res = await transferOwnership(roomId, targetUserId);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Ownership successfully transferred.");
    }
    setIsPending(false);
  };

  const handleLeave = async () => {
    setIsPending(true);
    const res = await leaveRoom(roomId);
    if (res.error) {
      toast.error(res.error);
      setIsPending(false);
    } else {
      toast.success("You have left the room.");
      router.push("/rooms");
    }
  };

  return (
    <>
      {canTransferOwnership && (
        <DropdownMenuItem
          disabled={isPending}
          onClick={handleTransfer}
          className="text-amber-600 focus:text-amber-600 dark:text-amber-500 dark:focus:text-amber-500"
        >
          <ShieldAlert />
          <span>Make Room Owner</span>
        </DropdownMenuItem>
      )}

      {canRemove && (
        <DropdownMenuItem
          disabled={isPending}
          onClick={handleRemove}
          className="text-destructive focus:text-destructive"
        >
          <UserMinus />
          <span>Remove</span>
        </DropdownMenuItem>
      )}

      {canLeaveRoom && (
        <DropdownMenuItem
          disabled={isPending}
          onClick={handleLeave}
          className="text-destructive focus:text-destructive"
        >
          <LogOut />
          <span>Leave Room</span>
        </DropdownMenuItem>
      )}
    </>
  );
}

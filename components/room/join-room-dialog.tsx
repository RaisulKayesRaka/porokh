"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { joinRoom } from "@/app/actions/room";
import { joinRoomSchema, JoinRoomInput } from "@/lib/validations/room";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
  FieldContent,
} from "@/components/ui/field";

export function JoinRoomDialog({
  children,
  open,
  onOpenChange,
}: {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = open !== undefined && onOpenChange !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange : setInternalOpen;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<JoinRoomInput>({
    resolver: zodResolver(joinRoomSchema),
    defaultValues: {
      roomCode: "",
    },
  });

  const onSubmit = async (data: JoinRoomInput) => {
    const res = await joinRoom(data);
    if (res.error) {
      toast.error(res.error);
    } else if (res.success) {
      toast.success(res.message || "Successfully joined room!");
      setDialogOpen(false);
      reset();
      if (res.room) {
        router.push(`/rooms/${res.room.id}`);
      }
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : isControlled ? null : (
          <Button variant="outline">Join Room</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Join a Room</DialogTitle>
            <DialogDescription>
              Ask your examiner for the room code, then enter it here to join.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="roomCode">Room Code</FieldLabel>
                <FieldContent>
                  <Input
                    id="roomCode"
                    placeholder="e.g. AB12C3"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.roomCode}
                    className="font-mono uppercase"
                    {...register("roomCode")}
                  />
                </FieldContent>
                {errors.roomCode ? (
                  <FieldError>{errors.roomCode.message}</FieldError>
                ) : (
                  <p className="text-muted-foreground mt-2 text-xs">
                    Must be exactly 6 characters consisting of letters and
                    numbers.
                  </p>
                )}
              </Field>
            </FieldGroup>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Joining..." : "Join"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

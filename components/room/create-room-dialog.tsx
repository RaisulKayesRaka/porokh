"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createRoom } from "@/app/actions/room";
import { createRoomSchema, CreateRoomInput } from "@/lib/validations/room";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
  FieldContent,
} from "@/components/ui/field";

export function CreateRoomDialog({
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
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateRoomInput>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: CreateRoomInput) => {
    const res = await createRoom(data);
    if (res.error) {
      toast.error(res.error);
    } else if (res.success) {
      toast.success("Room created successfully!");
      setDialogOpen(false);
      reset();
      // Optional: redirect to the new room, or just let them see the refreshed list
      router.push(`/rooms/${res.room.id}`);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : isControlled ? null : (
          <Button type="button">Create Room</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create Room</DialogTitle>
            <DialogDescription>
              Create a new examination room. Enter the room details below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Room Name</FieldLabel>
                <FieldContent>
                  <Input
                    id="name"
                    placeholder="e.g. Computer Science 101"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.name}
                    {...register("name")}
                  />
                </FieldContent>
                {errors.name && <FieldError>{errors.name.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="description">
                  Description (Optional)
                </FieldLabel>
                <FieldContent>
                  <div
                    className="relative rounded-md border border-input bg-transparent shadow-xs focus-within:ring-[3px] focus-within:ring-ring/50 focus-within:border-ring transition-[color,box-shadow]"
                    aria-invalid={!!errors.description}
                  >
                    <Textarea
                      id="description"
                      placeholder="e.g. Midterm examination room."
                      className="min-h-[120px] resize-none overflow-y-auto border-0 focus-visible:ring-0 shadow-none pb-8 bg-transparent"
                      disabled={isSubmitting}
                      maxLength={70}
                      {...register("description")}
                    />
                    <div className="absolute bottom-2 left-3 text-sm text-muted-foreground pointer-events-none">
                      {(watch("description") || "").length}/70 characters
                    </div>
                  </div>
                </FieldContent>
                {errors.description && (
                  <FieldError className="mt-2">{errors.description.message}</FieldError>
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
              {isSubmitting ? "Creating..." : "Create Room"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

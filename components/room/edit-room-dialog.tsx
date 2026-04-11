"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { editRoom } from "@/app/actions/room";
import { editRoomSchema, EditRoomInput } from "@/lib/validations/room";

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

type EditRoomDialogProps = {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  roomId: string;
  initialName: string;
  initialDescription: string | null;
};

export function EditRoomDialog({
  children,
  open,
  onOpenChange,
  roomId,
  initialName,
  initialDescription,
}: EditRoomDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = open !== undefined && onOpenChange !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange : setInternalOpen;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EditRoomInput>({
    resolver: zodResolver(editRoomSchema),
    defaultValues: {
      roomId,
      name: initialName,
      description: initialDescription || "",
    },
  });

  // Reset form values if the dialog opens/closes (e.g. to catch up to prop changes)
  useEffect(() => {
    if (dialogOpen) {
      reset({
        roomId,
        name: initialName,
        description: initialDescription || "",
      });
    }
  }, [dialogOpen, initialName, initialDescription, roomId, reset]);

  const onSubmit = async (data: EditRoomInput) => {
    const res = await editRoom(data);
    if (res.error) {
      toast.error(res.error);
    } else if (res.success) {
      toast.success("Room updated successfully!");
      setDialogOpen(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : isControlled ? null : (
          <Button variant="outline" size="sm">
            Edit Room
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Room Details</DialogTitle>
            <DialogDescription>
              Make changes to your room&apos;s name and description.
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
                  <Textarea
                    id="description"
                    placeholder="e.g. Midterm examination room."
                    className="max-h-36 resize-none overflow-y-auto"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.description}
                    {...register("description")}
                  />
                </FieldContent>
                {errors.description && (
                  <FieldError>{errors.description.message}</FieldError>
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

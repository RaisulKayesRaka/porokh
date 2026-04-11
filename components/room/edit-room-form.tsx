"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { editRoom } from "@/app/actions/room";
import { editRoomSchema, EditRoomInput } from "@/lib/validations/room";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
  FieldContent,
} from "@/components/ui/field";

type EditRoomFormProps = {
  roomId: string;
  initialName: string;
  initialDescription: string | null;
};

export function EditRoomForm({
  roomId,
  initialName,
  initialDescription,
}: EditRoomFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<EditRoomInput>({
    resolver: zodResolver(editRoomSchema),
    defaultValues: {
      roomId,
      name: initialName,
      description: initialDescription || "",
    },
  });

  const descriptionValue = watch("description") ?? initialDescription ?? "";

  const onSubmit = async (data: EditRoomInput) => {
    const res = await editRoom(data);
    if (res.error) {
      toast.error(res.error);
    } else if (res.success) {
      toast.success("Room updated successfully!");
      // Reset the form with the new data to update 'isDirty' state
      reset({
        roomId: res.room.id,
        name: res.room.name,
        description: res.room.description || "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          <FieldLabel htmlFor="description">Description (Optional)</FieldLabel>
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
                {descriptionValue.length}/70 characters
              </div>
            </div>
          </FieldContent>
          {errors.description && (
            <FieldError className="mt-2">{errors.description.message}</FieldError>
          )}
        </Field>
      </FieldGroup>

      <div className="flex justify-end">
        <Button type="submit" disabled={!isDirty || isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

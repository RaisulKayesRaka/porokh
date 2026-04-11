"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { updateNameSchema, UpdateNameInput } from "@/lib/validations/user";
import { updateUser } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
  FieldContent,
} from "@/components/ui/field";

type UpdateNameFormProps = {
  initialName: string;
};

export function UpdateNameForm({ initialName }: UpdateNameFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<UpdateNameInput>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: {
      name: initialName,
    },
  });

  const onSubmit = async (data: UpdateNameInput) => {
    const { error } = await updateUser({
      name: data.name,
    });

    if (error) {
      toast.error(error.message || "Failed to update name.");
    } else {
      toast.success("Name updated successfully!");
      reset({ name: data.name }); // Reset isDirty state
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Display Name</FieldLabel>
          <FieldContent>
            <Input
              id="name"
              {...register("name")}
              disabled={isSubmitting}
              aria-invalid={!!errors.name}
            />
          </FieldContent>
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
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

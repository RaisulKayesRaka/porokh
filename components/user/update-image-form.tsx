"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { updateImageSchema, UpdateImageInput } from "@/lib/validations/user";
import { updateUser } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldError,
  FieldLabel,
  FieldContent,
} from "@/components/ui/field";

type UpdateImageFormProps = {
  initialImage: string | undefined | null;
  userName: string;
};

export function UpdateImageForm({ initialImage, userName }: UpdateImageFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    watch,
  } = useForm<UpdateImageInput>({
    resolver: zodResolver(updateImageSchema),
    defaultValues: {
      imageUrl: initialImage || "",
    },
  });

  const previewUrl = watch("imageUrl");

  const onSubmit = async (data: UpdateImageInput) => {
    const { error } = await updateUser({
      image: data.imageUrl || "",
    });

    if (error) {
      toast.error(error.message || "Failed to update profile image.");
    } else {
      toast.success("Profile image updated successfully!");
      reset({ imageUrl: data.imageUrl }); // Reset isDirty state
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={previewUrl || undefined} alt={userName} />
          <AvatarFallback className="text-lg">{userName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="text-sm text-muted-foreground">
          Enter an image URL to update your avatar.
        </div>
      </div>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="imageUrl">Image URL</FieldLabel>
          <FieldContent>
            <Input
              id="imageUrl"
              placeholder="https://example.com/avatar.png"
              {...register("imageUrl")}
              disabled={isSubmitting}
              aria-invalid={!!errors.imageUrl}
            />
          </FieldContent>
          {errors.imageUrl && <FieldError>{errors.imageUrl.message}</FieldError>}
        </Field>
      </FieldGroup>
      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          className="text-destructive border-destructive/20 hover:bg-destructive/10"
          disabled={!initialImage || isSubmitting}
          onClick={async () => {
            const { error } = await updateUser({ image: "" });
            if (error) {
              toast.error(error.message || "Failed to remove image.");
            } else {
              toast.success("Profile image removed!");
              reset({ imageUrl: "" });
              router.refresh();
            }
          }}
        >
          Remove Photo
        </Button>
        <Button type="submit" disabled={!isDirty || isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

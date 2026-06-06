"use client";

import { createAdmin, USERS_QUERY_KEY } from "@/lib/users.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { Loader2Icon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const inviteSchema = z.object({
  name: z
    .string()
    .min(2, "Name is too short")
    .trim()
    .transform((val) => val.replace(/\s+/g, " ")),
  email: z.string().email("Invalid email").trim().toLowerCase(),
});

type InviteData = z.infer<typeof inviteSchema>;

interface InviteDialogModalProps {
  onClose: () => void;
}

export function InviteDialogModal({ onClose }: InviteDialogModalProps) {
  const queryClient = useQueryClient();
  const { handleSubmit, reset, control } = useForm<InviteData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: "", name: "" },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createAdmin,
  });

  const onSubmit = async ({ email, name }: InviteData) => {
    try {
      const nameArray = name.split(" ");
      const firstName = nameArray[0] ?? "";
      const lastName = nameArray.length > 1 ? nameArray.slice(1).join(" ") : "";
      await mutateAsync({ email, firstName, lastName });
      toast.success("Added a new member");
      onClose();
      reset();
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    } catch (error: any) {
      toast.error("Failed to send invite", { description: error?.message });
    }
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Add team member</DialogTitle>
        <DialogDescription>
          They'll receive an email invite and appear as Pending until they
          accept.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Full name</FieldLabel>
              <Input
                {...field}
                id="name"
                type="text"
                required
                autoComplete="name"
                placeholder="John Doe"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email address</FieldLabel>
              <Input
                {...field}
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="m@example.com"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <DialogFooter className="mt-2">
          <Button
            type="button"
            className="cursor-pointer"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" className="cursor-pointer" disabled={isPending}>
            {isPending && <Loader2Icon className="size-4 animate-spin" />}
            Submit
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

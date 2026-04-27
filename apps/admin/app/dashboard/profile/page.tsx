"use client";

import { ImageCropper } from "@/components/image-cropper";
import { useAuthStore } from "@/store/auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
import { CameraIcon, Loader2Icon, UploadIcon } from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1544723795-3fb6469f5b39";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    DEFAULT_AVATAR,
  );
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState<string | null>(null);
  const user = useAuthStore((s) => s.user);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      name: [user?.firstName, user?.lastName].filter(Boolean).join(" "),
      email: user?.email ?? "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    toast.success("Profile updated", {
      description: "Your preferences are now in sync",
    });
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      event.target.value = "";
      return;
    }

    setIsAvatarUploading(true);

    const reader = new FileReader();

    reader.onload = () => {
      const imageDataUrl = reader.result as string;
      const img = new Image();
      img.src = imageDataUrl;

      img.onload = () => {
        if (img.width < 100 || img.height < 100) {
          toast.error("Image is too small! Please upload at least 100x100.");
          setIsAvatarUploading(false);
          return;
        }
        setPendingAvatar(imageDataUrl);
        setIsCropperOpen(true);
        setIsAvatarUploading(false);
      };
    };

    reader.onloadend = () => setIsAvatarUploading(false);
    reader.onerror = () => {
      setIsAvatarUploading(false);
      toast.error("Something went wrong while reading the image");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleAvatarReset = () => {
    setAvatarPreview(null);
    setPendingAvatar(null);
    setIsCropperOpen(false);
    toast.message("Avatar removed", {
      description: "Upload a new image to replace it",
    });
  };

  const handleCropComplete = (croppedImage: string) => {
    setAvatarPreview(croppedImage);
    setPendingAvatar(null);
  };

  const handleCropperOpenChange: Dispatch<SetStateAction<boolean>> = (
    value,
  ) => {
    setIsCropperOpen((previous) => {
      const nextValue = typeof value === "function" ? value(previous) : value;
      if (!nextValue) setPendingAvatar(null);
      return nextValue;
    });
  };

  const openFileDialog = () => fileInputRef.current?.click();

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6">
        <header className="flex flex-col gap-2 px-4 pt-6 lg:px-6">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Edit your profile
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your personal information, communication preferences, and
            account security in one place.
          </p>
        </header>

        <div className="px-4 pb-6 lg:px-6">
          <div className="grid gap-4 xl:grid-cols-1">
            <section className="flex flex-col gap-4">
              <Card className="ring-0">
                <CardContent className="flex flex-col min-[410px]:flex-row items-start min-[410px]:items-center gap-5">
                  <div className="relative">
                    <Avatar
                      className={cn(
                        "size-28 border border-border bg-muted/20",
                        isAvatarUploading && "opacity-60",
                      )}
                    >
                      {avatarPreview ? (
                        <AvatarImage src={avatarPreview} alt="Profile avatar" />
                      ) : (
                        <AvatarFallback>JR</AvatarFallback>
                      )}
                    </Avatar>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute bottom-0 right-0"
                      onClick={openFileDialog}
                      disabled={isAvatarUploading}
                      aria-label="Upload avatar"
                    >
                      {isAvatarUploading ? (
                        <Loader2Icon className="size-4 animate-spin" />
                      ) : (
                        <CameraIcon className="size-4" />
                      )}
                    </Button>
                  </div>

                  <div className="flex flex-col items-start gap-3">
                    <p className="text-sm text-muted-foreground text-left leading-relaxed max-w-prose">
                      Supported formats: JPG, PNG, or GIF. Max size 5 MB.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        onClick={openFileDialog}
                        disabled={isAvatarUploading}
                      >
                        <UploadIcon className="size-4" />
                        Upload new
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleAvatarReset}
                        disabled={!avatarPreview || isAvatarUploading}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/gif"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </CardContent>
              </Card>
            </section>
            <form
              className="flex flex-col gap-4 w-full sm:max-w-xl"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <Card className="ring-0">
                <CardHeader>
                  <CardTitle>Personal information</CardTitle>
                  <CardDescription>
                    These details are visible to your workspace members.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="name">Full name</FieldLabel>
                            <Input
                              {...field}
                              id="name"
                              autoComplete="given-name"
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                      <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                              {...field}
                              id="email"
                              type="email"
                              autoComplete="email"
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </div>
                  </FieldGroup>
                </CardContent>
              </Card>

              <div className="flex flex-wrap gap-3 px-3">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="cursor-pointer w-full min-[400px]:w-auto"
                >
                  {form.formState.isSubmitting && (
                    <Loader2Icon className="size-4 animate-spin" />
                  )}
                  Save changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ImageCropper
        image={pendingAvatar}
        open={isCropperOpen && Boolean(pendingAvatar)}
        setOpen={handleCropperOpenChange}
        onComplete={handleCropComplete}
      />
    </div>
  );
}

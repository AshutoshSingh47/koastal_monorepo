"use client";

import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth-store";
import { AdminUser } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@workspace/ui/components/input-otp";
import { cn } from "@workspace/ui/lib/utils";
import { GalleryVerticalEnd, MoveLeft, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CircularLoader } from "./circular-loader";

const RESEND_COOLDOWN = 60;

const emailSchema = z.object({
  email: z.string().min(1, "Required").email("Invalid email address"),
  otp: z.string().optional(),
});

const otpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

type LoginFormData = z.infer<typeof emailSchema> | z.infer<typeof otpSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const setUser = useAuthStore((s) => s.setUser);
  const [step, setStep] = useState<"EMAIL" | "OTP">("EMAIL");
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const form = useForm<LoginFormData>({
    resolver: (values, context, options) =>
      zodResolver(step === "OTP" ? otpSchema : emailSchema)(
        values,
        context,
        options,
      ),
    defaultValues: { email: "", otp: "" },
    shouldUnregister: false,
  });

  const otpValue = form.watch("otp") ?? "";
  const emailValue = form.watch("email");
  const isOtpComplete = otpValue.length === 6;

  function startCooldown() {
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    setCooldown(RESEND_COOLDOWN);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  async function handleResend() {
    setIsResending(true);
    try {
      const email = form.getValues("email");
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });

      if (error) {
        toast.error(error.message || "Failed to resend OTP");
      } else {
        form.resetField("otp");
        startCooldown();
        toast.success("OTP resent!");
      }
    } finally {
      setIsResending(false);
    }
  }

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);

    try {
      if (step === "EMAIL") {
        const { error } = await authClient.emailOtp.sendVerificationOtp({
          email: data.email,
          type: "sign-in",
        });
        if (error) {
          form.setError("email", {
            type: "manual",
            message: error.message || "Email not authorized",
          });
        } else {
          toast.success("OTP sent to your email!");
          setStep("OTP");
          startCooldown();
        }
      } else {
        const { data: signInData, error } = await authClient.signIn.emailOtp({
          email: data.email,
          otp: data.otp || "",
        });

        if (error) {
          form.setError("otp", {
            type: "manual",
            message: error.message || "Invalid OTP code",
          });
        } else {
          if (signInData?.user) {
            setUser(signInData.user as unknown as AdminUser);
          }
          toast.success("Logged in successfully!");
          router.push("/dashboard");
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <a href="#" className="flex flex-col items-center gap-2 font-medium">
          <div className="flex size-8 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-6" />
          </div>
          <span className="sr-only">Koastal</span>
        </a>
        <h1 className="text-xl font-bold">Welcome to Koastal</h1>
      </div>
      <Card>
        <CardHeader>
          {step === "OTP" && (
            <Button
              variant="link"
              type="button"
              className="cursor-pointer flex items-center w-fit text-left px-0 hover:no-underline text-muted-foreground hover:text-foreground"
              onClick={() => {
                setStep("EMAIL");
                form.resetField("otp");
              }}
            >
              <MoveLeft className="size-4" />
              Back
            </Button>
          )}
          {step === "EMAIL" ? (
            <CardTitle>Login to your account</CardTitle>
          ) : (
            <CardTitle>Verify OTP</CardTitle>
          )}
          {step === "EMAIL" ? (
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          ) : (
            <CardDescription>
              {`Enter the code sent to ${emailValue}`}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <form id="form-login" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className={cn(step === "OTP" && "hidden")}>
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
                        aria-invalid={fieldState.invalid}
                        placeholder="m@example.com"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
              {step === "OTP" && (
                <Controller
                  name="otp"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <InputOTP
                        className="w-full"
                        maxLength={6}
                        value={field.value}
                        onChange={field.onChange}
                        pattern={"^\\d+$"}
                      >
                        <InputOTPGroup className="w-full *:data-[slot=input-otp-slot]:w-full *:data-[slot=input-otp-slot]:h-10 sm:*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:text-xl">
                          <InputOTPSlot
                            className="mr-1 sm:mr-2 rounded-md border"
                            index={0}
                          />
                          <InputOTPSlot
                            className="mx-1 sm:mx-2 rounded-md border"
                            index={1}
                          />
                          <InputOTPSlot
                            className="mx-1 sm:mx-2 rounded-md border"
                            index={2}
                          />
                          <InputOTPSlot
                            className="mx-1 sm:mx-2 rounded-md border"
                            index={3}
                          />
                          <InputOTPSlot
                            className="mx-1 sm:mx-2 rounded-md border"
                            index={4}
                          />
                          <InputOTPSlot
                            className="ml-1 sm:ml-2 rounded-md border"
                            index={5}
                          />
                        </InputOTPGroup>
                      </InputOTP>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              )}
              <Field>
                {step === "EMAIL" ? (
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="cursor-pointer"
                  >
                    {isLoading ? <CircularLoader /> : "Continue"}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading || !isOtpComplete}
                    className="cursor-pointer"
                  >
                    {isLoading ? <CircularLoader /> : "Enter OTP"}
                  </Button>
                )}
                {step === "OTP" && (
                  <Button
                    variant="outline"
                    type="button"
                    className="cursor-pointer"
                    disabled={cooldown > 0 || isResending}
                    onClick={handleResend}
                  >
                    {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
                  </Button>
                )}
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

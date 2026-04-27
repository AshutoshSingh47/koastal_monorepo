import { LoginForm } from "@/components/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Koastal",
};

export default function Page() {
  return (
    <div className="flex min-h-dvh relative w-full items-center justify-center">
      <div className="w-full max-w-sm mx-4 sm:mx-0">
        <LoginForm />
      </div>
    </div>
  );
}

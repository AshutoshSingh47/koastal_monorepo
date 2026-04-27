import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ClockIcon, ShieldOffIcon, UserXIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Account Status | Koastal",
};

async function getSession() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  try {
    const res = await fetch("http://localhost:8080/api/auth/get-session", {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const body = await res.text();
    return body ? JSON.parse(body) : null;
  } catch {
    return null;
  }
}

const STATUS_CONTENT = {
  PENDING: {
    icon: ClockIcon,
    iconClass: "text-yellow-500",
    title: "Your account is pending approval",
    description:
      "Your account has been created and is waiting for a super-admin to approve it. You will receive a login link via email once approved.",
  },
  BLOCKED: {
    icon: ShieldOffIcon,
    iconClass: "text-red-500",
    title: "Your account has been suspended",
    description:
      "Access to your account has been suspended. Please contact your super-admin for more information.",
  },
  DEACTIVATED: {
    icon: UserXIcon,
    iconClass: "text-muted-foreground",
    title: "Your account has been deactivated",
    description:
      "Your account has been permanently deactivated. If you believe this is a mistake, please contact your administrator.",
  },
} as const;

export default async function WaitingPage() {
  const session = await getSession();
  const status: keyof typeof STATUS_CONTENT =
    session?.user?.status in STATUS_CONTENT ? session.user.status : "PENDING";

  const { icon: Icon, iconClass, title, description } = STATUS_CONTENT[status];

  return (
    <div className="flex min-h-dvh w-full items-center justify-center">
      <div className="flex w-full max-w-sm mx-4 sm:mx-0 flex-col items-center gap-6 text-center">
        <div className={`rounded-full bg-muted p-4 ${iconClass}`}>
          <Icon className="size-8" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        <p className="text-muted-foreground text-xs">
          Signed in as{" "}
          <span className="text-foreground font-medium">
            {session?.user?.email ?? "unknown"}
          </span>
        </p>
      </div>
    </div>
  );
}

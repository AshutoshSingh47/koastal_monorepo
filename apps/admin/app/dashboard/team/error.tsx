"use client";

import { Button } from "@workspace/ui/components/button";
import { AlertCircleIcon } from "lucide-react";
import { useEffect } from "react";

interface TeamErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function TeamError({ error, reset }: TeamErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6">
        <header className="flex flex-col gap-1 px-4 pt-6 lg:px-6">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Team
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your team members and their access levels.
          </p>
        </header>

        <div className="flex flex-1 items-center justify-center px-4 pb-6 lg:px-6">
          <div className="flex max-w-sm flex-col items-center gap-4 text-center">
            <div className="bg-destructive/10 text-destructive flex size-12 items-center justify-center rounded-full">
              <AlertCircleIcon className="size-6" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-semibold">
                Failed to load team members
              </h2>
              <p className="text-muted-foreground text-sm">
                {error.message || "Something went wrong. Please try again."}
              </p>
            </div>
            <Button onClick={reset} variant="outline" className="cursor-pointer">
              Try again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

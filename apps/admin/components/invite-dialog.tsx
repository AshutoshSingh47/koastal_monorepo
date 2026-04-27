"use client";

import { Button } from "@workspace/ui/components/button";
import { Dialog } from "@workspace/ui/components/dialog";
import { UserPlus } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

const InviteDialogModal = dynamic(
  () =>
    import("@/components/invite-dialog-modal").then((m) => m.InviteDialogModal),
  { ssr: false },
);

export function InviteDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        className="mt-1 shrink-0 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <UserPlus className="size-4" />
        Add member
      </Button>
      {isOpen && <InviteDialogModal onClose={() => setIsOpen(false)} />}
    </Dialog>
  );
}

import { cn } from "@workspace/ui/lib/utils";

interface Props {
  className?: string;
  children: React.ReactNode;
}

export function ContentContainer({ className, children }: Props) {
  return (
    <div className={cn("max-w-[1680px] px-4 mx-auto", className)}>
      {children}
    </div>
  );
}

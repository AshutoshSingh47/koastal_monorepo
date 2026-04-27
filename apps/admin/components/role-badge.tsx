import { AdminUser } from "@/types/auth";
import { Badge } from "@workspace/ui/components/badge";

export function RoleBadge({ role }: { role: AdminUser["role"] }) {
  if (role === "SUPER_ADMIN") {
    return <Badge>Super Admin</Badge>;
  }
  return (
    <Badge variant="outline" className="text-muted-foreground">
      Admin
    </Badge>
  );
}

type ROLE = "PENDING" | "ACTIVE" | "BLOCKED";
export interface AdminUser {
  id: string;
  name?: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string;
  status: ROLE;
  emailVerified: boolean;
  role: "ADMIN" | "SUPER_ADMIN";
  image?: string | null;
  createdAt: string;
  updatedAt: string;
}

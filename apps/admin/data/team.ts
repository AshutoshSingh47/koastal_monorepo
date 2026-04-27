import { AdminUser } from "@/types/auth";

export const MOCK_MEMBERS: Omit<AdminUser, "image" | "updatedAt">[] = [
  {
    id: "1",
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@koastal.com",
    role: "SUPER_ADMIN",
    emailVerified: true,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    firstName: "Bob",
    lastName: "Smith",
    email: "bob@koastal.com",
    role: "ADMIN",
    emailVerified: true,
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    firstName: "Carol",
    lastName: "Williams",
    email: "carol@koastal.com",
    role: "ADMIN",
    emailVerified: false,
    createdAt: "2024-03-10",
  },
  {
    id: "4",
    firstName: "David",
    lastName: "Brown",
    email: "david@koastal.com",
    role: "ADMIN",
    emailVerified: true,
    createdAt: "2024-04-05",
  },
  {
    id: "5",
    firstName: "Emma",
    lastName: "Davis",
    email: "emma@koastal.com",
    role: "ADMIN",
    emailVerified: false,
    createdAt: "2024-05-22",
  },
];

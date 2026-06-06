import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient, Role, Status } from "@prisma/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load the API's .env so DATABASE_URL is set before PrismaClient connects
(process as NodeJS.Process & { loadEnvFile: (p: string) => void }).loadEnvFile(
  path.resolve(__dirname, "../../../apps/api/.env")
);

const prisma = new PrismaClient();

const fakeUsers = [
  {
    name: "Alice Johnson",
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice.johnson@koastal.dev",
    role: Role.ADMIN,
    status: Status.ACTIVE,
    emailVerified: true,
  },
  {
    name: "Bob Martinez",
    firstName: "Bob",
    lastName: "Martinez",
    email: "bob.martinez@koastal.dev",
    role: Role.ADMIN,
    status: Status.PENDING,
    emailVerified: false,
  },
  {
    name: "Carol Williams",
    firstName: "Carol",
    lastName: "Williams",
    email: "carol.williams@koastal.dev",
    role: Role.ADMIN,
    status: Status.BLOCKED,
    emailVerified: true,
  },
  {
    name: "David Chen",
    firstName: "David",
    lastName: "Chen",
    email: "david.chen@koastal.dev",
    role: Role.ADMIN,
    status: Status.DEACTIVATED,
    emailVerified: true,
  },
  {
    name: "Eva Patel",
    firstName: "Eva",
    lastName: "Patel",
    email: "eva.patel@koastal.dev",
    role: Role.SUPER_ADMIN,
    status: Status.ACTIVE,
    emailVerified: true,
  },
  {
    name: "Frank Okafor",
    firstName: "Frank",
    lastName: "Okafor",
    email: "frank.okafor@koastal.dev",
    role: Role.SUPER_ADMIN,
    status: Status.PENDING,
    emailVerified: false,
  },
  {
    name: "Grace Kim",
    firstName: "Grace",
    lastName: "Kim",
    email: "grace.kim@koastal.dev",
    role: Role.SUPER_ADMIN,
    status: Status.BLOCKED,
    emailVerified: true,
  },
  {
    name: "Henry Nguyen",
    firstName: "Henry",
    lastName: "Nguyen",
    email: "henry.nguyen@koastal.dev",
    role: Role.SUPER_ADMIN,
    status: Status.DEACTIVATED,
    emailVerified: false,
  },
];

async function main() {
  console.log("Seeding fake users...\n");

  for (const user of fakeUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { ...user },
      create: { ...user },
    });
    console.log(`  ✓ ${user.name} (${user.role} / ${user.status})`);
  }

  console.log(`\nDone. ${fakeUsers.length} fake users upserted.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: "muskelon1111@gmail.com" },
  });

  await prisma.permission.upsert({
    where: { userId_resource: { userId: user.id, resource: "SUPER_ADMIN" } },
    update: { actions: ["create", "read", "update", "delete"] },
    create: {
      userId: user.id,
      resource: "SUPER_ADMIN",
      actions: ["create", "read", "update", "delete"],
    },
  });

  console.log("Done.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

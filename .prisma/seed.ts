import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const password = process.env.ADMIN_SEED_PASSWORD ?? "Admin@12345";
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email: "admin@localli.com" },
    update: {
      name: "Platform Admin",
      password: hashedPassword,
      role: Role.ADMIN,
    },
    create: {
      name: "Platform Admin",
      email: "admin@localli.com",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });
}

main()
  .catch((error) => {
    console.error("ADMIN SEED ERROR:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

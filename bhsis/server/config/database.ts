import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

let prisma: PrismaClient;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL precisa estar configurada para o BHSIS");
}

const adapterFactory = new PrismaPg({
  connectionString: databaseUrl,
});

const createPrismaClient = () => new PrismaClient({ adapter: adapterFactory });

if (process.env.NODE_ENV === "production") {
  prisma = createPrismaClient();
} else {
  let globalWithPrisma = global as typeof globalThis & {
    prisma?: PrismaClient;
  };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = createPrismaClient();
  }
  prisma = globalWithPrisma.prisma;
}

export default prisma;

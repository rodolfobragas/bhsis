import { PrismaClient, UserRole } from "../../prisma/generated/auth";
import { PrismaPg } from "@prisma/adapter-pg";

let prisma: PrismaClient;

const databaseUrl = process.env.DATABASE_URL_AUTH;
if (!databaseUrl) {
  throw new Error("DATABASE_URL_AUTH precisa estar configurada para o BHSIS");
}

const adapterFactory = new PrismaPg({
  connectionString: databaseUrl,
});

const createPrismaClient = () => new PrismaClient({ adapter: adapterFactory });

if (process.env.NODE_ENV === "production") {
  prisma = createPrismaClient();
} else {
  let globalWithPrisma = global as typeof globalThis & {
    authPrisma?: PrismaClient;
  };
  if (!globalWithPrisma.authPrisma) {
    globalWithPrisma.authPrisma = createPrismaClient();
  }
  prisma = globalWithPrisma.authPrisma;
}

export { UserRole };
export default prisma;

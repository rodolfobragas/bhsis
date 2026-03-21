import { PrismaClient } from "../../prisma/generated/food";
import { PrismaPg } from "@prisma/adapter-pg";

let prisma: PrismaClient;

const databaseUrl = process.env.DATABASE_URL_FOOD;
if (!databaseUrl) {
  throw new Error("DATABASE_URL_FOOD precisa estar configurada para o BHSIS");
}

const adapterFactory = new PrismaPg({
  connectionString: databaseUrl,
});

const createPrismaClient = () => new PrismaClient({ adapter: adapterFactory });

if (process.env.NODE_ENV === "production") {
  prisma = createPrismaClient();
} else {
  let globalWithPrisma = global as typeof globalThis & {
    foodPrisma?: PrismaClient;
  };
  if (!globalWithPrisma.foodPrisma) {
    globalWithPrisma.foodPrisma = createPrismaClient();
  }
  prisma = globalWithPrisma.foodPrisma;
}

export default prisma;

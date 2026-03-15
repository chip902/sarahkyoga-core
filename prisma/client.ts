import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma";

const prismaClientSingleton = () => {
	const adapter = new PrismaPg({
		connectionString: process.env.DATABASE_PRISMA_URL ?? "",
	});

	return new PrismaClient({
		adapter,
		log: ["query", "info", "warn", "error"],
	});
};

declare global {
	var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

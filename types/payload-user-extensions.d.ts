// types/payload-user-extensions.d.ts
import "payload";
import { User as PrismaUser } from "@prisma/client";

declare module "payload" {
	export interface User {
		role?: PrismaUser["role"];
	}
}

// This allows you to use the extended type in your application
export {};

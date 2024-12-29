// app/api/payload/[...payload]/route.ts
import { createPayloadClient } from "@payloadcms/next-payload";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import buildConfig from "@/payload.config";
import { NextRequest } from "next/server";

interface User {
	id: string;
	email: string;
	role: string;
}

export const { GET, POST, PUT, PATCH, DELETE } = createPayloadClient({
	buildConfig,
	auth: {
		verify: async (req: NextRequest) => {
			const session = await getServerSession(authOptions);
			if (!session?.user) return false;

			return {
				...session.user,
				role: session.user.role || "user",
			} as User;
		},
	},
});

import NextAuth, { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/prisma/client";
import bcrypt from "bcryptjs";

declare module "next-auth" {
	interface User {
		id: string;
		role: string;
		email: string;
		image?: string;
		password?: string;
	}

	interface AdapterUser {
		id: string;
		role: string;
	}

	interface Session {
		user: {
			id: string;
			role: string;
		} & User;
		accessToken?: string;
	}

	interface JWT {
		id: string;
		role: string;
		accessToken?: string;
	}
}

const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					console.error("Missing email or password", credentials);
					throw new Error("Email and password are required");
				}

				console.log("Received credentials:", credentials);

				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				});

				if (user && bcrypt.compareSync(credentials.password, user.password)) {
					console.log("Authentication successful for user:", user);

					// Ensuring role is a string
					return {
						id: user.id,
						name: user.name,
						email: user.email,
						role: user.role ?? "user",
					};
				} else {
					console.error("Invalid email or password");
					throw new Error("Invalid email or password");
				}
			},
		}),
	],
	pages: {
		signIn: "/auth/login",
	},
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
			}
			console.log("JWT callback - token:", token); // Debugging
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id as string;
				session.user.role = token.role as string;
			}
			console.log("Session callback - session:", session); // Debugging
			return session;
		},
		async signIn({ user, account }) {
			if (account?.provider === "google") {
				const existingUser = await prisma.user.findUnique({
					where: { email: user.email },
				});

				if (!existingUser) {
					await prisma.user.create({
						data: {
							name: user.name,
							email: user.email,
							image: user.image ?? undefined,
							role: user.role ?? "user",
						},
					});
				}
			}
			return true;
		},
	},
	debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, handler as OPTIONS };

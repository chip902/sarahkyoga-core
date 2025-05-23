// lib/auth.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/prisma/client";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			authorization: {
				params: {
					scope: "https://www.googleapis.com/auth/calendar.readonly",
				},
			},
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

				if (user && user.password && bcrypt.compareSync(credentials.password, user.password)) {
					console.log("Authentication successful for user:", user);

					// Ensuring role is a string
					return {
						id: user.id,
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
		signOut: "/auth/logout",
	},
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user && "role" in user) {
				token.id = user.id;
				token.role = user.role;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string;
				session.user.role = token.role as string;
			}
			return session;
		},
		async signIn({ user, account }) {
			if (account?.provider === "google") {
				const existingUser = await prisma.user.findUnique({
					where: { email: user.email ?? "" },
				});

				if (!existingUser) {
					await prisma.user.create({
						data: {
							email: user.email ?? "",
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

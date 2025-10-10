// app/api/admin/users/route.ts

import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

// GET all users (admin only)
export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		// Check if user is authenticated and is an admin
		if (!session || !session.user || session.user.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const users = await prisma.user.findMany({
			orderBy: {
				email: "asc",
			},
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
				role: true,
				type: true,
				image: true,
				emailVerified: true,
				// Exclude sensitive fields like password, resetToken
				_count: {
					select: {
						orders: true,
						carts: true,
					},
				},
			},
		});

		return NextResponse.json(users, { status: 200 });
	} catch (error) {
		console.error("Error fetching users:", error);
		return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
	}
}

// POST - Create new user (admin only)
export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		// Check if user is authenticated and is an admin
		if (!session || !session.user || session.user.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();

		// Validation schema
		const schema = z.object({
			email: z.string().email("Invalid email address"),
			firstName: z.string().min(1, "First name is required"),
			lastName: z.string().min(1, "Last name is required"),
			password: z.string().min(8, "Password must be at least 8 characters"),
			role: z.enum(["user", "admin"]).default("user"),
		});

		const validation = schema.safeParse(body);
		if (!validation.success) {
			return NextResponse.json(
				{ error: "Validation failed", details: validation.error.errors },
				{ status: 400 }
			);
		}

		const { email, firstName, lastName, password, role } = validation.data;

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email: email.toLowerCase() },
		});

		if (existingUser) {
			return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create the user
		const newUser = await prisma.user.create({
			data: {
				email: email.toLowerCase(),
				firstName,
				lastName,
				password: hashedPassword,
				role,
				type: "registered",
			},
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
				role: true,
				type: true,
			},
		});

		return NextResponse.json(newUser, { status: 201 });
	} catch (error) {
		console.error("Error creating user:", error);
		return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
	}
}

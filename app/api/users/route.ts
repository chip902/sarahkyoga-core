/**
 * DEPRECATED: These routes are deprecated in favor of /api/admin/users
 * These routes now require admin authentication for security.
 * Use /api/admin/users instead for user management.
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		// Require admin authentication
		if (!session || !session.user || session.user.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
		}

		const users = await prisma.user.findMany();
		return NextResponse.json(users);
	} catch (error) {
		console.error(error);
		return new NextResponse("Error fetching users", { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		// Require admin authentication
		if (!session || !session.user || session.user.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
		}

		const body = await req.json();

		const schema = z.object({
			firstName: z.string(),
			lastName: z.string(),
			email: z.string().email(),
			password: z.string().min(8),
		});

		const validation = schema.safeParse(body);
		if (!validation.success) return NextResponse.json(validation.error.errors, { status: 400 });

		const hashedPassword = await bcrypt.hash(body.password, 10);

		const newUser = await prisma.user.create({
			data: {
				firstName: body.firstName,
				lastName: body.lastName,
				email: body.email,
				password: hashedPassword,
			},
		});

		return NextResponse.json(newUser, { status: 201 });
	} catch (error) {
		console.error(error);
		return new NextResponse("Error creating user", { status: 500 });
	}
}

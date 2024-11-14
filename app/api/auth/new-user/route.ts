// app/api/auth/new-user/route.ts
import prisma from "@/prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { email, password, firstName, lastName } = body;

		if (!email || !password || !firstName || !lastName) {
			return NextResponse.json({ message: "Missing fields" }, { status: 400 });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				firstName,
				lastName,
			},
		});

		return NextResponse.json(user, { status: 201 });
	} catch (error) {
		console.error("Error during user creation:", error);
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

export async function GET(request: NextRequest) {
	try {
		const users = await prisma.user.findMany();
		return NextResponse.json(users);
	} catch (error) {
		console.error(error);
		return new NextResponse("Error fetching users", { status: 500 });
	}
}
export async function POST(req: NextRequest) {
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
}

import prisma from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
	first_name: z.string().min(1).max(255),
	last_name: z.string().min(1).max(255),
	email: z.string().email(),
});

export async function POST(request: NextRequest) {
	const body = await request.json();
	const validation = schema.safeParse(body);
	if (!validation.success) return NextResponse.json(validation.error.errors, { status: 400 });
	const newUser = await prisma.user.create({
		data: { first_name: body.first_name, last_name: body.last_name, email: body.email },
	});
	return NextResponse.json(newUser, { status: 201 });
}

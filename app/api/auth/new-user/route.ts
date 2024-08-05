// app/api/auth/new-user/route.ts
import prisma from "@/prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
	if (req.method !== "POST") {
		return res.status(405).end();
	}

	const { email, password, name } = req.body;

	if (!email || !password || !name) {
		return res.status(400).json({ message: "Missing fields" });
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	try {
		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				name,
			},
		});

		res.status(200).json(user);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
}

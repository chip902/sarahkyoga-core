import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user || session.user.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const subscribers = await prisma.subscriber.findMany({
			orderBy: { createdAt: "desc" },
		});

		return NextResponse.json(subscribers, { status: 200 });
	} catch (error) {
		console.error("Error fetching subscribers:", error);
		return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user || session.user.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { email, name } = await request.json();

		if (!email || typeof email !== "string") {
			return NextResponse.json({ error: "Email is required" }, { status: 400 });
		}

		const existing = await prisma.subscriber.findUnique({
			where: { email: email.toLowerCase().trim() },
		});

		if (existing) {
			return NextResponse.json({ error: "Subscriber already exists" }, { status: 409 });
		}

		const subscriber = await prisma.subscriber.create({
			data: {
				email: email.toLowerCase().trim(),
				name: name || null,
				active: true,
				unsubscribeToken: randomUUID(),
			},
		});

		return NextResponse.json(subscriber, { status: 201 });
	} catch (error) {
		console.error("Error creating subscriber:", error);
		return NextResponse.json({ error: "Failed to create subscriber" }, { status: 500 });
	}
}

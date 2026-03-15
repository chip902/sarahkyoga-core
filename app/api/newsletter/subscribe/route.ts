import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(request: Request) {
	try {
		const { email, name } = await request.json();

		if (!email || typeof email !== "string") {
			return NextResponse.json({ error: "Email is required" }, { status: 400 });
		}

		// Check if email already exists in Subscriber table
		const existingSubscriber = await prisma.subscriber.findUnique({
			where: { email },
		});

		if (existingSubscriber) {
			// Reactivate if inactive
			if (!existingSubscriber.active) {
				await prisma.subscriber.update({
					where: { email },
					data: { active: true },
				});
			}
			return NextResponse.json({
				success: true,
				message: "You're already subscribed! Welcome back.",
			});
		}

		// Check if email exists in User table with newsletterOptIn
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser?.newsletterOptIn) {
			return NextResponse.json({
				success: true,
				message: "You're already subscribed as a registered user!",
			});
		}

		// Create new subscriber
		await prisma.subscriber.create({
			data: {
				email,
				name: name || null,
				active: true,
			},
		});

		return NextResponse.json({
			success: true,
			message: "Successfully subscribed!",
		});
	} catch (error) {
		console.error("Error subscribing:", error);
		return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
	}
}

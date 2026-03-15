import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import prisma from "@/prisma/client";
import { authOptions } from "@/lib/auth";

export async function PATCH(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { newsletterOptIn } = await request.json();

		if (typeof newsletterOptIn !== "boolean") {
			return NextResponse.json({ error: "newsletterOptIn must be a boolean" }, { status: 400 });
		}

		const email = session.user.email;
		let updated = false;

		// Update User table if the user exists there
		const user = await prisma.user.findUnique({ where: { email } });
		if (user) {
			await prisma.user.update({
				where: { email },
				data: { newsletterOptIn },
			});
			updated = true;
		}

		// Update Subscriber table if the user exists there
		const subscriber = await prisma.subscriber.findUnique({ where: { email } });
		if (subscriber) {
			await prisma.subscriber.update({
				where: { email },
				data: { active: newsletterOptIn },
			});
			updated = true;
		} else if (newsletterOptIn) {
			// User wants to subscribe but isn't in Subscriber table — create entry
			await prisma.subscriber.create({
				data: {
					email,
					active: true,
					unsubscribeToken: randomUUID(),
				},
			});
			updated = true;
		}

		if (!updated) {
			return NextResponse.json({ error: "No subscription record found" }, { status: 404 });
		}

		return NextResponse.json({
			success: true,
			newsletterOptIn,
		});
	} catch (error) {
		console.error("Error updating newsletter preference:", error);
		return NextResponse.json({ error: "Failed to update preference" }, { status: 500 });
	}
}

export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
			select: { newsletterOptIn: true },
		});

		// Also check if they're in the Subscriber table
		const subscriber = await prisma.subscriber.findUnique({
			where: { email: session.user.email },
			select: { active: true },
		});

		// User is subscribed if either source says so
		const isSubscribed = user?.newsletterOptIn || subscriber?.active || false;

		return NextResponse.json({
			newsletterOptIn: isSubscribed,
		});
	} catch (error) {
		console.error("Error fetching newsletter preference:", error);
		return NextResponse.json({ error: "Failed to fetch preference" }, { status: 500 });
	}
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

/**
 * Unsubscribe a subscriber by token.
 * Used for both:
 * - RFC 8058 one-click List-Unsubscribe (GET with token query param)
 * - Human-friendly unsubscribe page (POST with token in body)
 */
async function unsubscribeByToken(token: string) {
	const subscriber = await prisma.subscriber.findUnique({
		where: { unsubscribeToken: token },
	});

	if (!subscriber) {
		return NextResponse.json({ error: "Invalid unsubscribe token" }, { status: 404 });
	}

	if (!subscriber.active) {
		return NextResponse.json({
			success: true,
			message: "You are already unsubscribed.",
		});
	}

	await prisma.subscriber.update({
		where: { id: subscriber.id },
		data: { active: false },
	});

	// Also opt out the User record if one exists with this email
	await prisma.user.updateMany({
		where: { email: subscriber.email, newsletterOptIn: true },
		data: { newsletterOptIn: false },
	});

	return NextResponse.json({
		success: true,
		message: "You have been unsubscribed.",
	});
}

/** GET handler for RFC 8058 one-click unsubscribe via List-Unsubscribe header */
export async function GET(request: NextRequest) {
	try {
		const token = request.nextUrl.searchParams.get("token");

		if (!token) {
			return NextResponse.json({ error: "Token is required" }, { status: 400 });
		}

		return await unsubscribeByToken(token);
	} catch (error) {
		console.error("Error unsubscribing (GET):", error);
		return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 });
	}
}

/** POST handler for human-friendly unsubscribe page */
export async function POST(request: Request) {
	try {
		const { token } = await request.json();

		if (!token) {
			return NextResponse.json({ error: "Token is required" }, { status: 400 });
		}

		return await unsubscribeByToken(token);
	} catch (error) {
		console.error("Error unsubscribing (POST):", error);
		return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 });
	}
}

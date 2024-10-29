// app/api/newsletters/publish/route.ts
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

export async function POST(request: Request) {
	const frontendDomain = process.env.VERCEL_URL ? process.env.VERCEL_URL : "sarahkyoga.com";
	const origin =
		process.env.NODE_ENV === "production"
			? "https://sarahkyoga.com"
			: frontendDomain.includes("localhost")
			? "http://localhost:3001"
			: `https://${frontendDomain}`;
	const res = NextResponse.next();
	res.headers.set("Access-Control-Allow-Origin", origin);
	res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

	// Handle OPTIONS request for CORS preflight
	if (request.method === "OPTIONS") {
		return new NextResponse(null, { status: 200 });
	}
	try {
		// First, fetch subscribers from the API
		const subscribersResponse = await fetch("/api/newsletter/subscribers");
		if (!subscribersResponse.ok) {
			throw new Error("Failed to fetch subscribers");
		}
		const subscribers = await subscribersResponse.json();

		const body = await request.json();
		const { newsletterId } = body;

		// Fetch the newsletter
		const newsletter = await prisma.newsletter.findUnique({
			where: { id: newsletterId },
		});

		if (!newsletter) {
			return NextResponse.json({ error: "Newsletter not found" }, { status: 404 });
		}

		// Send email to all subscribers
		sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

		const emailPromises = subscribers.map((subscriber: string) => {
			const msg = {
				to: subscriber,
				from: "Sarah K. Yoga",
				subject: newsletter.title,
				html: newsletter.content,
			};

			return sgMail.send(msg);
		});

		await Promise.all(emailPromises);

		// Update newsletter status to published
		await prisma.newsletter.update({
			where: { id: newsletterId },
			data: {
				isDraft: false,
				sentDate: new Date(),
			},
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error publishing newsletter:", error);
		return NextResponse.json({ error: "Failed to publish newsletter" }, { status: 500 });
	}
}

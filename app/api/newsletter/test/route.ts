import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

export async function POST(request: Request) {
	const frontendDomain = process.env.VERCEL_URL ? process.env.VERCEL_URL : "sarahkyoga.com";
	const origin = process.env.NODE_ENV === "production" ? "https://sarahkyoga.com" : `http://localhost:3001`;

	try {
		const res = NextResponse.next();
		res.headers.set("Access-Control-Allow-Origin", origin);
		res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
		const body = await request.json();
		const { subject, content } = body;

		// Send email to all subscribers
		sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

		const msg = {
			to: ["sarah@sarahkyoga.com", "andrew@chip-hosting.com"],
			from: "Sarah K. Yoga <noreply@sarahkyoga.com>",
			subject: subject,
			html: content,
		};

		await sgMail.send(msg).catch((error) => {
			console.error(`Error sending test email: `, error); // Add logging statement
			throw error;
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error publishing newsletter:", error); // Add logging statement
		return NextResponse.json({ error: "Failed to publish newsletter" }, { status: 500 });
	}
}

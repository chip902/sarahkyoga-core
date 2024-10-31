import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export async function POST(request: Request) {
	const frontendDomain = process.env.VERCEL_URL ? process.env.VERCEL_URL : "sarahkyoga.com";
	const origin = process.env.NODE_ENV === "production" ? "https://sarahkyoga.com" : `http://localhost:3000`;

	try {
		// First, fetch subscribers from the API
		const subscribersResponse = await axios.get(`${origin}/api/newsletter/subscribers`);
		if (!subscribersResponse) {
			throw new Error("Failed to fetch subscribers");
		}
		const subscribers = await subscribersResponse.data;
		const res = NextResponse.next();
		res.headers.set("Access-Control-Allow-Origin", origin);
		res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
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
				from: "Sarah K. Yoga <noreply@sarahkyoga.com>",
				subject: newsletter.title,
				html: newsletter.content,
			};

			console.log(`Sending email to: ${subscriber}`); // Add logging statement

			return sgMail.send(msg).catch((error) => {
				console.error(`Error sending email to ${subscriber}:`, error); // Add logging statement
				throw error;
			});
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
		console.error("Error publishing newsletter:", error); // Add logging statement
		return NextResponse.json({ error: "Failed to publish newsletter" }, { status: 500 });
	}
}

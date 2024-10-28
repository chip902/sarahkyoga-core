// app/api/newsletters/publish/route.ts
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { newsletterId, subscribers } = body;

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
				from: process.env.SENDGRID_FROM_EMAIL as string,
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

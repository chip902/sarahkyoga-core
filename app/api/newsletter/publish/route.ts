import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/prisma/client";
import sgMail from "@sendgrid/mail";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.id || session.user.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { newsletterId } = body;

		// Fetch the newsletter
		const newsletter = await prisma.newsletter.findUnique({
			where: { id: newsletterId },
		});

		if (!newsletter) {
			return NextResponse.json({ error: "Newsletter not found" }, { status: 404 });
		}

		// Fetch all subscribers (from Subscriber table)
		const subscribers = await prisma.subscriber.findMany({
			where: { active: true },
			select: { email: true },
		});

		// Fetch opted-in users (from User table)
		const optedInUsers = await prisma.user.findMany({
			where: { newsletterOptIn: true },
			select: { email: true },
		});

		// Combine and deduplicate emails
		const allEmails = [...subscribers.map((s) => s.email), ...optedInUsers.map((u) => u.email)];
		const uniqueEmails = [...new Set(allEmails)];

		if (uniqueEmails.length === 0) {
			return NextResponse.json({ error: "No subscribers found" }, { status: 400 });
		}

		// Send email to all subscribers
		sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

		const emailPromises = uniqueEmails.map((email) => {
			const msg = {
				to: email,
				from: "Sarah K. Yoga <noreply@sarahkyoga.com>",
				subject: newsletter.title,
				html: newsletter.content,
			};

			return sgMail.send(msg).catch((error) => {
				console.error(`Error sending email to ${email}:`, error);
				// Don't throw - continue with other emails
				return { error: true, email, message: error.message };
			});
		});

		const results = await Promise.all(emailPromises);
		const failedEmails = results.filter((r) => r && typeof r === "object" && "error" in r);

		// Update newsletter status to published
		await prisma.newsletter.update({
			where: { id: newsletterId },
			data: {
				isDraft: false,
				publishedAt: new Date(),
				sentDate: new Date(),
			},
		});

		return NextResponse.json({
			success: true,
			sentCount: uniqueEmails.length - failedEmails.length,
			totalCount: uniqueEmails.length,
			failedCount: failedEmails.length,
			failedEmails: failedEmails.map((f) => (f as { email: string }).email),
		});
	} catch (error) {
		console.error("Error publishing newsletter:", error);
		return NextResponse.json({ error: "Failed to publish newsletter" }, { status: 500 });
	}
}

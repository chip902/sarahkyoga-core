import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { randomUUID } from "crypto";
import prisma from "@/prisma/client";
import sgMail from "@sendgrid/mail";
import { authOptions } from "@/lib/auth";

const buildEmailHtml = (content: string, unsubscribeUrl: string): string => {
	const footer = `
		<div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #718096;">
			<p>You received this email because you subscribed to the Sarah K Yoga newsletter.</p>
			<p><a href="${unsubscribeUrl}" style="color: #718096; text-decoration: underline;">Unsubscribe</a></p>
		</div>
	`;
	return content + footer;
};

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

		// Fetch all subscribers with unsubscribe tokens
		const subscribers = await prisma.subscriber.findMany({
			where: { active: true },
			select: { email: true, unsubscribeToken: true },
		});

		// Fetch opted-in users
		const optedInUsers = await prisma.user.findMany({
			where: { newsletterOptIn: true },
			select: { email: true },
		});

		const baseUrl = process.env.NEXTAUTH_URL || "https://sarahkyoga.com";

		// Build a map of email -> unsubscribeToken (deduplicates automatically)
		const recipientTokenMap = new Map<string, string>();

		for (const sub of subscribers) {
			if (!recipientTokenMap.has(sub.email)) {
				// Backfill token if missing
				const token = sub.unsubscribeToken ?? randomUUID();
				if (!sub.unsubscribeToken) {
					await prisma.subscriber.update({
						where: { email: sub.email },
						data: { unsubscribeToken: token },
					});
				}
				recipientTokenMap.set(sub.email, token);
			}
		}

		// For opted-in users without a Subscriber record, create one with a token
		for (const user of optedInUsers) {
			if (!recipientTokenMap.has(user.email)) {
				const token = randomUUID();
				const existing = await prisma.subscriber.findUnique({
					where: { email: user.email },
				});
				if (existing) {
					// Subscriber record exists but was inactive or missing token
					const updatedToken = existing.unsubscribeToken ?? token;
					if (!existing.unsubscribeToken) {
						await prisma.subscriber.update({
							where: { email: user.email },
							data: { unsubscribeToken: updatedToken },
						});
					}
					recipientTokenMap.set(user.email, updatedToken);
				} else {
					await prisma.subscriber.create({
						data: {
							email: user.email,
							active: true,
							unsubscribeToken: token,
						},
					});
					recipientTokenMap.set(user.email, token);
				}
			}
		}

		if (recipientTokenMap.size === 0) {
			return NextResponse.json({ error: "No subscribers found" }, { status: 400 });
		}

		// Send email to all subscribers
		sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

		const emailPromises = Array.from(recipientTokenMap.entries()).map(([email, token]) => {
			// Human-friendly unsubscribe link in email footer (points to React page)
			const pageUnsubscribeUrl = `${baseUrl}/unsubscribe?token=${token}`;
			// RFC 8058 List-Unsubscribe header (points to API endpoint)
			const apiUnsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?token=${token}`;

			const msg = {
				to: email,
				from: "Sarah K. Yoga <noreply@sarahkyoga.com>",
				subject: newsletter.title,
				html: buildEmailHtml(newsletter.content, pageUnsubscribeUrl),
				headers: {
					"List-Unsubscribe": `<${apiUnsubscribeUrl}>`,
					"List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
				},
			};

			return sgMail.send(msg).catch((error) => {
				console.error(`Error sending email to ${email}:`, error);
				return { error: true, email, message: error.message };
			});
		});

		const results = await Promise.all(emailPromises);
		const failedEmails = results.filter((r) => r && typeof r === "object" && "error" in r);
		const sentCount = recipientTokenMap.size - failedEmails.length;

		// Only mark as published if at least one email was sent
		if (sentCount > 0) {
			await prisma.newsletter.update({
				where: { id: newsletterId },
				data: {
					isDraft: false,
					publishedAt: new Date(),
					sentDate: new Date(),
				},
			});
		} else {
			return NextResponse.json({
				error: "All emails failed to send. Newsletter was not published.",
				failedCount: failedEmails.length,
				failedEmails: failedEmails.map((f) => (f as { email: string }).email),
			}, { status: 500 });
		}

		return NextResponse.json({
			success: true,
			sentCount,
			totalCount: recipientTokenMap.size,
			failedCount: failedEmails.length,
			failedEmails: failedEmails.map((f) => (f as { email: string }).email),
		});
	} catch (error) {
		console.error("Error publishing newsletter:", error);
		return NextResponse.json({ error: "Failed to publish newsletter" }, { status: 500 });
	}
}

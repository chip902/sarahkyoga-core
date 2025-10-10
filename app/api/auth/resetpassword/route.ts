// app/api/resetPassword.ts
import prisma from "@/prisma/client";
import sgMail from "@sendgrid/mail";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function POST(req: NextRequest) {
	try {
		// Parse request body
		const body = await req.json();
		const { email } = body;

		// Validate email is provided
		if (!email || typeof email !== "string") {
			console.error("Invalid email provided:", email);
			return NextResponse.json(
				{ error: "Valid email address is required" },
				{ status: 400 }
			);
		}

		sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

		const user = await prisma.user.findUnique({
			where: { email: email.toLowerCase() },
		});

		if (!user) {
			// Don't reveal if user exists or not for security
			return NextResponse.json(
				{ message: "If an account with that email exists, a reset link has been sent." },
				{ status: 200 }
			);
		}

		const resetToken = uuid();
		const tokenExpiry = new Date(Date.now() + 900 * 1000); // Token expires in 15 minutes

		await prisma.user.update({
			where: { id: user.id },
			data: { resetToken: resetToken, resetTokenExpiry: tokenExpiry },
		});

		const msg = {
			to: user.email,
			from: "Sarah K. Yoga <noreply@sarahkyoga.com>",
			subject: "Password Reset Request",
			html: `
				<p>Hi ${user.firstName || "there"}!</p>
				<p>You recently requested a password reset.</p>
				<p>Please click on the following link to reset your password:</p>
				<a href="https://sarahkyoga.com/auth/reset-password/${resetToken}">Reset Password</a>
				<p>This link will expire in 15 minutes.</p>
				<p>If you did not request a password reset, please ignore this email.</p>
				<p>Thanks,</p>
				<p>Sarah</p>
			`,
		};

		await sgMail.send(msg);

		return NextResponse.json(
			{ message: "Password reset email sent successfully" },
			{ status: 200 }
		);
	} catch (error: any) {
		console.error("Error sending password reset email:", error);

		// Check if it's a JSON parsing error
		if (error instanceof SyntaxError) {
			return NextResponse.json(
				{ error: "Invalid request body" },
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{ error: "Failed to process password reset request" },
			{ status: 500 }
		);
	}
}

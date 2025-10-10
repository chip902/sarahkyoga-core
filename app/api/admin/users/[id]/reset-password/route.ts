// app/api/admin/users/[id]/reset-password/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sgMail from "@sendgrid/mail";
import { v4 as uuid } from "uuid";

// POST - Admin triggers password reset for a user
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const session = await getServerSession(authOptions);

		// Check if user is authenticated and is an admin
		if (!session || !session.user || session.user.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;

		// Find the user
		const user = await prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
			},
		});

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Generate reset token
		const resetToken = uuid();
		const tokenExpiry = new Date(Date.now() + 12 * 60 * 60 * 1000); // Token expires in 12 hours

		// Update user with reset token
		await prisma.user.update({
			where: { id },
			data: {
				resetToken,
				resetTokenExpiry: tokenExpiry,
			},
		});

		// Send email via SendGrid
		sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

		const msg = {
			to: user.email,
			from: "Sarah K. Yoga <noreply@sarahkyoga.com>",
			subject: "Password Reset Request",
			html: `
				<p>Hi ${user.firstName || "there"}!</p>
				<p>An administrator has initiated a password reset for your account.</p>
				<p>Please click on the following link to reset your password:</p>
				<a href="https://sarahkyoga.com/auth/reset-password/${resetToken}">Reset Password</a>
				<p>This link will expire in 12 hours.</p>
				<p>If you did not request a password reset, please contact us immediately.</p>
				<p>Thanks,</p>
				<p>Sarah</p>
			`,
		};

		await sgMail.send(msg);

		return NextResponse.json(
			{
				message: "Password reset email sent successfully",
				email: user.email,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error sending password reset email:", error);
		return NextResponse.json({ error: "Failed to send password reset email" }, { status: 500 });
	}
}

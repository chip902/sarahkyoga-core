// app/api/auth/resetpassword/[token]/route.ts

import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
	try {
		const { token } = await params;

		if (!token) {
			return NextResponse.json({ error: "Invalid reset token" }, { status: 400 });
		}

		// Parse JSON body
		const body = await request.json();
		const { newPassword } = body;

		if (!newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
			return NextResponse.json(
				{ error: "Password must be at least 8 characters" },
				{ status: 400 }
			);
		}

		// Validate Token: Check if the token is valid and not expired
		const user = await prisma.user.findUnique({
			where: { resetToken: token },
		});

		if (!user) {
			return NextResponse.json(
				{ error: "Invalid or expired reset token" },
				{ status: 400 }
			);
		}

		// Check if token has expired
		if (user.resetTokenExpiry && new Date() > user.resetTokenExpiry) {
			return NextResponse.json(
				{ error: "Reset token has expired. Please request a new one." },
				{ status: 400 }
			);
		}

		// Hash the new password
		const hashedPassword = await bcrypt.hash(newPassword, 10);

		// Update the password and clear reset token
		await prisma.user.update({
			where: { id: user.id },
			data: {
				password: hashedPassword,
				resetToken: null,
				resetTokenExpiry: null,
			},
		});

		return NextResponse.json(
			{ message: "Password reset successful" },
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error updating password:", error);
		return NextResponse.json(
			{ error: "An error occurred while resetting your password" },
			{ status: 500 }
		);
	}
}

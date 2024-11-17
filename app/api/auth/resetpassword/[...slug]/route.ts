// app/api/auth/resetpassword/[...slug]/route.ts

import prisma from "@/prisma/client";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
	const token = request.nextUrl.searchParams.get("slug")?.[0] as string; // Extract the token
	if (!token) {
		return new Response("Invalid reset token", { status: 400 });
	}
	// 1. Validate Token: Check if the token is valid in your database
	const user = await prisma.user.findUnique({ where: { resetToken: token } });
	if (!user) {
		return new Response("Invalid reset token", { status: 400 });
	}

	// 2. Update Password: If valid, update the user's password in the database
	const formData = await request.formData();
	const newPassword = formData.get("newPassword"); // Assuming the new password is sent as form data
	if (!newPassword || typeof newPassword !== "string") {
		// Handle error: No new password provided or not a string
		return new Response("No new password provided or invalid format", { status: 400 });
	}

	const hashedPassword = await bcrypt.hash(newPassword, 10);
	try {
		await prisma.user.update({
			where: { id: user.id },
			data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
		});

		return new Response("Password reset successful", { status: 200 });
	} catch (error) {
		console.error("Error updating password:", error);
		return new Response("An error occurred while resetting your password.", { status: 500 });
	}
}

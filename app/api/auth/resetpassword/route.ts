// app/api/resetPassword.ts
import prisma from "@/prisma/client";
import sgMail from "@sendgrid/mail";
import { NextRequest } from "next/server";
import { v4 as uuid } from "uuid";

export async function POST(req: NextRequest) {
	const { email } = await req.json(); // Extract email from request body

	sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

	try {
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			return new Response("User not found", { status: 404 }); // Return a response with an error message and a 404 status code
		}

		const resetToken = uuid();
		const tokenExpiry = new Date(Date.now() + 900 * 1000); // Token expires in 15 minutes

		await prisma.user.update({
			where: { email },
			data: { resetToken: resetToken, resetTokenExpiry: tokenExpiry },
		});

		const msg = {
			to: user.email,
			from: "Sarah K. Yoga <noreply@sarahkyoga.com>",
			subject: "Password Reset Request",
			html: `
                  <p>Hi!</p>
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

		return new Response("Email sent successfully", { status: 201 }); // Return a successful response with a 200 status code by default
	} catch (error) {
		console.error("Error sending password reset email:", error);
		return new Response("Internal Server Error", { status: 500 }); // Return an internal server error response with a 500 status code
	} finally {
		await prisma.$disconnect();
	}
}

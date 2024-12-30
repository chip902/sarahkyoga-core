import { NextRequest, NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

export async function POST(req: NextRequest) {
	const frontendDomain = process.env.VERCEL_URL ? process.env.VERCEL_URL : "sarahkyoga.com";
	const origin =
		process.env.NODE_ENV === "production"
			? "https://sarahkyoga.com"
			: frontendDomain.includes("localhost")
			? "http://localhost:3001"
			: `https://${frontendDomain}`;

	const res = NextResponse.next();
	res.headers.set("Access-Control-Allow-Origin", origin);
	res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

	// Handle OPTIONS request for CORS preflight
	if (req.method === "OPTIONS") {
		return new NextResponse(null, { status: 200 });
	}

	// Ensure that req.body is defined
	const body = await req.json();
	if (!body || !body.body) {
		return new NextResponse("Request body is missing", { status: 400 });
	}

	const emailData = JSON.parse(body.body);

	sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

	const { to, bcc, from, subject, text, html } = emailData;

	// Log the email details for debugging
	console.log("Email Details:", { to, bcc, from, subject, text, html });

	const msg = {
		to,
		bcc,
		from,
		subject,
		text,
		html,
	};

	try {
		await sgMail.send(msg);
		return new NextResponse("Email sent successfully", { status: 200 });
	} catch (error) {
		console.error("Error sending email:", error);
		return new NextResponse("Failed to send email", { status: 500 });
	}
}

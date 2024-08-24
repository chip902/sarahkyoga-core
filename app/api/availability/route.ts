import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

const serviceAccountKey = {
	type: "service_account",
	project_id: process.env.GOOGLE_PROJECT_ID,
	private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
	private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
	client_email: process.env.GOOGLE_CLIENT_EMAIL,
	client_id: process.env.GOOGLE_CLIENT_ID,
	auth_uri: process.env.GOOGLE_AUTH_URI,
	token_uri: process.env.GOOGLE_TOKEN_URI,
	auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
	client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
};

const getAvailability = async (timeMin: string, timeMax: string) => {
	const auth = new google.auth.GoogleAuth({
		credentials: serviceAccountKey,
		scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
	});

	const calendar = google.calendar({ version: "v3", auth });
	try {
		const calendarId = "r703c2gjeoakdo4fhb0l4cb2r8@group.calendar.google.com";

		const response = await calendar.freebusy.query({
			requestBody: {
				timeMin,
				timeMax,
				items: [{ id: calendarId }],
			},
		});

		console.log("Google Calendar FreeBusy API response:", JSON.stringify(response.data, null, 2));

		const busyTimes = response.data.calendars?.[calendarId]?.busy ?? [];
		return busyTimes.length === 0; // Return true if the time slot is free
	} catch (error) {
		console.error("Google Calendar API error:", error);
		throw new Error("Failed to check calendar availability.");
	}
};

export async function POST(req: NextRequest) {
	try {
		const { timeMin, timeMax } = await req.json();

		if (!timeMin || !timeMax) {
			return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
		}

		// Check availability
		const isAvailable = await getAvailability(timeMin, timeMax);
		return NextResponse.json({ isAvailable }, { status: 200 });
	} catch (error) {
		console.error("Error checking availability:", error);

		let errorMessage = "An unexpected error occurred.";
		if (error instanceof Error) {
			errorMessage = error.message;
		}

		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}

import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { readFileSync } from "fs";
import path from "path";

// Load the service account key file
const serviceAccountKey = JSON.parse(readFileSync(path.join(process.cwd(), "config/sarahkyoga-core-92d711d18fe3.json"), "utf8"));

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

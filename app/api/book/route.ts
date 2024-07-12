// app/api/book/route.ts
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(req: NextRequest) {
	const { date, name, email, accessToken } = await req.json();

	const auth = new google.auth.OAuth2();
	auth.setCredentials({ access_token: accessToken });

	const calendar = google.calendar({ version: "v3", auth });

	const event = {
		summary: `Booking with ${name}`,
		description: `Booking made by ${email}`,
		start: {
			dateTime: date,
			timeZone: "America/Los_Angeles",
		},
		end: {
			dateTime: new Date(new Date(date).getTime() + 60 * 60 * 1000).toISOString(), // 1 hour later
			timeZone: "America/Los_Angeles",
		},
	};

	try {
		await calendar.events.insert({
			calendarId: "primary",
			requestBody: event,
		});
		return NextResponse.json({ message: "Booking successful!" }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

// app/api/availability/route.ts
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

const getAvailability = async (accessToken: string) => {
	const auth = new google.auth.OAuth2();
	auth.setCredentials({ access_token: accessToken });

	const calendar = google.calendar({ version: "v3", auth });

	const events = await calendar.events.list({
		calendarId: "primary",
		timeMin: new Date().toISOString(),
		maxResults: 10,
		singleEvents: true,
		orderBy: "startTime",
	});

	return events.data.items || [];
};

export async function POST(req: NextRequest) {
	const { accessToken } = await req.json();
	try {
		const availability = await getAvailability(accessToken);
		return NextResponse.json(availability, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error }, { status: 500 });
	}
}

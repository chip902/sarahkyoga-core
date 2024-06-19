// lib/google.ts
import { google } from "googleapis";

export async function getAvailability(accessToken: string, calendarId = "primary") {
	const auth = new google.auth.OAuth2();
	auth.setCredentials({ access_token: accessToken });

	const calendar = google.calendar({ version: "v3", auth });

	const events = await calendar.events.list({
		calendarId,
		timeMin: new Date().toISOString(),
		maxResults: 10,
		singleEvents: true,
		orderBy: "startTime",
	});

	return events.data.items || [];
}

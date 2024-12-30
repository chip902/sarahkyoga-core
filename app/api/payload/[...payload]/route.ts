import { NextRequest, NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/payload";
import { headers } from "next/headers";

// This handler will process all GET and POST requests to /api/payload/[...payload]
async function handler(req: NextRequest) {
	const payload = await getPayloadClient();

	// Get incoming headers
	const headersList = await headers();
	const referer = headersList.get("referer");

	// Pass the request through Payload
	const res = await payload.handle({
		req,
		headers: {
			...Object.fromEntries(headersList.entries()),
			host: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
			referer: referer || undefined,
		},
	});

	// Convert the Payload response to a NextResponse
	const response = new NextResponse(res.body, {
		status: res.status,
		headers: res.headers as HeadersInit,
	});

	return response;
}

export { handler as GET, handler as POST, handler as PATCH, handler as PUT, handler as DELETE };

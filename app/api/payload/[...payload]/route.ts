// app/api/payload/[...payload]/route.ts
import { NextRequest, NextResponse } from "next/server";
import payload from "payload";
import { initPayload } from "@/lib/payload";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function handlePayloadRoute(req: NextRequest) {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		return new Response("Unauthorized", { status: 401 });
	}

	// Initialize Payload if not already initialized
	await initPayload();

	// Get the path and method from the request
	const pathname = req.nextUrl.pathname;
	const method = req.method;

	try {
		// Use Payload's find method to handle the route
		// You might need to adjust this based on your exact requirements
		const result = await payload.find({
			collection: "workshops", // Replace with appropriate collection
			limit: 50,
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error("Payload route error:", error);
		return NextResponse.json(
			{
				error: "Failed to process request",
			},
			{ status: 500 }
		);
	}
}

export async function GET(req: NextRequest) {
	return handlePayloadRoute(req);
}

export async function POST(req: NextRequest) {
	return handlePayloadRoute(req);
}

export async function PUT(req: NextRequest) {
	return handlePayloadRoute(req);
}

export async function PATCH(req: NextRequest) {
	return handlePayloadRoute(req);
}

export async function DELETE(req: NextRequest) {
	return handlePayloadRoute(req);
}

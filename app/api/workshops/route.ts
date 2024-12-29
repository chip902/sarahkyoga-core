// app/api/workshops/route.ts
import { NextRequest, NextResponse } from "next/server";
import { initPayload } from "@/lib/payload";

// Create a new workshop
export async function POST(req: NextRequest) {
	try {
		const payload = await initPayload();
		const workshopData = await req.json();

		const newWorkshop = await payload.create({
			collection: "workshops",
			data: workshopData,
		});

		return NextResponse.json(newWorkshop);
	} catch (error) {
		console.error("Error creating workshop:", error);
		return NextResponse.json(
			{
				error: "Failed to create workshop",
			},
			{ status: 500 }
		);
	}
}

// Get all workshops
export async function GET() {
	try {
		const payload = await initPayload();

		const workshops = await payload.find({
			collection: "workshops",
			limit: 50,
		});

		return NextResponse.json(workshops.docs);
	} catch (error) {
		console.error("Error fetching workshops:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch workshops",
			},
			{ status: 500 }
		);
	}
}

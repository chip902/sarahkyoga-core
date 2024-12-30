// app/api/payload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { initPayload } from "@/lib/payload"; // Adjust path as needed
import { Workshop } from "@/payload-types";

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
		return NextResponse.json({ error: "Failed to fetch workshops" }, { status: 500 });
	}
}

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
		return NextResponse.json({ error: "Failed to create workshop" }, { status: 500 });
	}
}

export async function PUT(req: NextRequest) {
	try {
		const payload = await initPayload();
		const workshopData = await req.json();

		if (!workshopData.id) {
			return NextResponse.json({ error: "Workshop ID is required" }, { status: 400 });
		}

		const updatedWorkshop = await payload.update({
			collection: "workshops",
			id: workshopData.id.toString(),
			data: workshopData,
		});

		return NextResponse.json(updatedWorkshop);
	} catch (error) {
		console.error("Error updating workshop:", error);
		return NextResponse.json({ error: "Failed to update workshop" }, { status: 500 });
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const payload = await initPayload();
		const id = req.nextUrl.pathname.split("/").pop();

		if (!id) {
			return NextResponse.json({ error: "Workshop ID is required" }, { status: 400 });
		}

		await payload.delete({
			collection: "workshops",
			id,
		});

		return NextResponse.json({ message: "Workshop deleted successfully" });
	} catch (error) {
		console.error("Error deleting workshop:", error);
		return NextResponse.json({ error: "Failed to delete workshop" }, { status: 500 });
	}
}

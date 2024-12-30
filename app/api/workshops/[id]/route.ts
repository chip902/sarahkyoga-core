// app/api/workshops/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { initPayload } from "@/lib/payload";

// Update a workshop
export async function PUT(req: NextRequest) {
	try {
		const body = await req.json();
		const payload = await initPayload();
		const workshopData = await req.json();

		const updatedWorkshop = await payload.update({
			collection: "workshops",
			id: body.id,
			data: workshopData,
		});

		return NextResponse.json(updatedWorkshop);
	} catch (error) {
		console.error("Error updating workshop:", error);
		return NextResponse.json(
			{
				error: "Failed to update workshop",
			},
			{ status: 500 }
		);
	}
}

// Delete a workshop
export async function DELETE(_req: NextRequest) {
	try {
		const body = await _req.json();
		const payload = await initPayload();

		await payload.delete({
			collection: "workshops",
			id: body.id,
		});

		return NextResponse.json({ message: "Workshop deleted successfully" });
	} catch (error) {
		console.error("Error deleting workshop:", error);
		return NextResponse.json(
			{
				error: "Failed to delete workshop",
			},
			{ status: 500 }
		);
	}
}

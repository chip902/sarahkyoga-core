import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(request: NextRequest) {
	const id = request.nextUrl.pathname.split("/").pop();

	try {
		const newsletter = await prisma.newsletter.findUnique({
			where: { id },
			select: {
				id: true,
				title: true,
				content: true,
				isDraft: true,
				style: true,
				createdAt: true,
				publishedAt: true,
			},
		});

		if (!newsletter) {
			return NextResponse.json({ error: "Newsletter not found" }, { status: 404 });
		}

		return NextResponse.json(newsletter);
	} catch (error) {
		console.error("Error fetching newsletter:", error);
		return NextResponse.json({ error: "Failed to fetch newsletter" }, { status: 500 });
	}
}

export async function PATCH(request: NextRequest) {
	const id = request.nextUrl.pathname.split("/").pop();

	try {
		const body = await request.json();
		const newsletter = await prisma.newsletter.update({
			where: { id },
			data: body,
		});

		return NextResponse.json(newsletter);
	} catch (error) {
		console.error("Error updating newsletter:", error);
		return NextResponse.json({ error: "Failed to update newsletter" }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest) {
	const id = request.nextUrl.pathname.split("/").pop();

	try {
		await prisma.newsletter.delete({
			where: { id },
		});

		return new NextResponse(null, { status: 204 });
	} catch (error) {
		console.error("Error deleting newsletter:", error);
		return NextResponse.json({ error: "Failed to delete newsletter" }, { status: 500 });
	}
}

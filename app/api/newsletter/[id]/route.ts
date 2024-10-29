import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(request: Request, { params }: { params: { id: string } }) {
	try {
		const newsletter = await prisma.newsletter.findUnique({
			where: { id: params.id },
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

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
	try {
		const body = await request.json();
		const newsletter = await prisma.newsletter.update({
			where: { id: params.id },
			data: body,
		});
		return NextResponse.json(newsletter);
	} catch (error) {
		console.error("Error updating newsletter:", error);
		return NextResponse.json({ error: "Failed to update newsletter" }, { status: 500 });
	}
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
	try {
		await prisma.newsletter.delete({
			where: { id: params.id },
		});
		return new NextResponse(null, { status: 204 });
	} catch (error) {
		console.error("Error deleting newsletter:", error);
		return NextResponse.json({ error: "Failed to delete newsletter" }, { status: 500 });
	}
}

import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user || session.user.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;
		const body = await request.json();

		const subscriber = await prisma.subscriber.findUnique({
			where: { id },
		});

		if (!subscriber) {
			return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
		}

		const updated = await prisma.subscriber.update({
			where: { id },
			data: {
				...(typeof body.active === "boolean" && { active: body.active }),
				...(body.name !== undefined && { name: body.name || null }),
			},
		});

		return NextResponse.json(updated, { status: 200 });
	} catch (error) {
		console.error("Error updating subscriber:", error);
		return NextResponse.json({ error: "Failed to update subscriber" }, { status: 500 });
	}
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user || session.user.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;

		const subscriber = await prisma.subscriber.findUnique({
			where: { id },
		});

		if (!subscriber) {
			return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
		}

		await prisma.subscriber.delete({
			where: { id },
		});

		return NextResponse.json({ success: true }, { status: 200 });
	} catch (error) {
		console.error("Error deleting subscriber:", error);
		return NextResponse.json({ error: "Failed to delete subscriber" }, { status: 500 });
	}
}

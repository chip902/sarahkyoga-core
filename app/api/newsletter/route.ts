// app/api/newsletter/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import * as z from "zod";

const createNewsletterSchema = z.object({
	content: z.string(),
	subject: z.string().optional(),
});

const updateNewsletterSchema = createNewsletterSchema.partial();

export async function GET(request: NextRequest) {
	try {
		const newsletters = await prisma.newsletter.findMany();
		return NextResponse.json(newsletters);
	} catch (error) {
		console.error("Error fetching newsletters:", error);
		return new NextResponse("Failed to fetch newsletters", { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const validation = createNewsletterSchema.safeParse(body);

		if (!validation.success) {
			return NextResponse.json(validation.error.errors, { status: 400 });
		}

		const newNewsletter = await prisma.newsletter.create({
			data: {
				content: body.content,
				subject: body.subject,
			},
		});

		return NextResponse.json(newNewsletter, { status: 201 });
	} catch (error) {
		console.error("Error creating newsletter:", error);
		return new NextResponse("Failed to create newsletter", { status: 500 });
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const id = Number(searchParams.get("id"));

		if (isNaN(id)) {
			return new NextResponse("Invalid ID", { status: 400 });
		}

		await prisma.newsletter.delete({
			where: { id },
		});

		return new NextResponse(`Newsletter with ID ${id} deleted successfully`, { status: 200 });
	} catch (error) {
		console.error("Error deleting newsletter:", error);
		return new NextResponse("Failed to delete newsletter", { status: 500 });
	}
}

export async function PATCH(req: NextRequest) {
	try {
		const body = await req.json();
		const validation = updateNewsletterSchema.safeParse(body);

		if (!validation.success) {
			return NextResponse.json(validation.error.errors, { status: 400 });
		}

		const id = Number(body.id);

		if (isNaN(id)) {
			return new NextResponse("Invalid ID", { status: 400 });
		}

		const updatedNewsletter = await prisma.newsletter.update({
			where: { id },
			data: {
				content: body.content,
				subject: body.subject,
			},
		});

		return NextResponse.json(updatedNewsletter);
	} catch (error) {
		console.error("Error updating newsletter:", error);
		return new NextResponse("Failed to update newsletter", { status: 500 });
	}
}

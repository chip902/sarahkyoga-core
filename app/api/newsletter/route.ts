import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { z } from "zod";

const newsletterSchema = z.object({
	title: z.string().min(1, "Title is required"),
	content: z.string().min(1, "Content is required"),
	isDraft: z.boolean().default(true),
	style: z.object({
		fontFamily: z.string(),
		fontSize: z.number(),
		isBold: z.boolean(),
		isItalic: z.boolean(),
		isUnderline: z.boolean(),
		textAlign: z.enum(["left", "center", "right"]),
		textColor: z.string(),
		backgroundColor: z.string(),
	}),
});

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const validatedData = newsletterSchema.parse(body);
		console.log("VALIDATED DATA: ", validatedData);

		const newsletter = await prisma.newsletter.create({
			data: {
				...validatedData,
				publishedAt: validatedData.isDraft ? null : new Date(),
			},
		});

		return NextResponse.json(newsletter, { status: 201 });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 });
		}
		console.error("ERROR in create newsletter: ", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}

export async function GET() {
	try {
		const newsletters = await prisma.newsletter.findMany({
			orderBy: { createdAt: "desc" },
		});
		return NextResponse.json(newsletters);
	} catch (error) {
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}

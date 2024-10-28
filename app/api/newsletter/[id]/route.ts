// app/api/newsletters/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(request: Request, { params }: { params: { id: string } }) {
	try {
		const newsletter = await prisma.newsletter.findUnique({
			where: { id: params.id },
		});

		if (!newsletter) {
			return NextResponse.json({ error: "Newsletter not found" }, { status: 404 });
		}

		return NextResponse.json(newsletter);
	} catch (error) {
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}

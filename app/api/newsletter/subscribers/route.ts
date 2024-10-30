import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET() {
	try {
		const subscribers = await prisma.subscriber.findMany({
			where: {
				active: true,
			},
		});
		console.log("SUBSCRIBERS ARE: ", subscribers);
		return NextResponse.json(subscribers.map((sub) => sub.email));
	} catch (error) {
		console.error("Error fetching subscribers:", error);
		return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
	}
}

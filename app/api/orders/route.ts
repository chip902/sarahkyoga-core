import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET() {
	try {
		const orders = await prisma.order.findMany({
			include: {
				user: true,
				items: {
					include: {
						product: true,
					},
				},
			},
		});

		return NextResponse.json(orders, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
	}
}

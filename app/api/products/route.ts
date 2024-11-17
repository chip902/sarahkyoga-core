import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET() {
	try {
		const products = await prisma.product.findMany();
		return NextResponse.json(products);
	} catch (error) {
		return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
	}
}

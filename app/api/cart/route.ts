// app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/prisma/client"; // Adjust the path to your Prisma client

export async function POST(req: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
		}

		const { productId } = await req.json();

		// Find or create the user's cart
		let cart = await prisma.cart.findFirst({
			where: {
				userId: session.user.id,
			},
		});

		if (!cart) {
			cart = await prisma.cart.create({
				data: {
					userId: session.user.id,
				},
			});
		}

		// Add the product to the cart
		await prisma.cartItem.create({
			data: {
				cartId: cart.id,
				productId,
			},
		});

		return NextResponse.json({ message: "Product added to cart" });
	} catch (error) {
		console.error("Error in /api/cart:", error); // Log the actual error
		return NextResponse.json({ error: "Failed to add product to cart" }, { status: 500 });
	}
}

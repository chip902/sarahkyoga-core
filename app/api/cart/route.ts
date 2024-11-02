// app/api/cart/route.ts

import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth"; // Adjust the path to your auth options

export async function POST(request: Request) {
	try {
		const { productId } = await request.json();
		const session = await getServerSession(authOptions);

		if (!session || !session.user) {
			return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
		}

		const userId = session.user.id;

		// Get or create the cart for the user
		let cart = await prisma.cart.findFirst({
			where: { userId },
		});

		if (!cart) {
			cart = await prisma.cart.create({
				data: {
					userId,
				},
			});
		}

		// Check if the product is already in the cart
		const existingCartItem = await prisma.cartItem.findFirst({
			where: {
				cartId: cart.id,
				productId,
			},
		});

		if (existingCartItem) {
			// If the product is already in the cart, increase the quantity
			const updatedCartItem = await prisma.cartItem.update({
				where: {
					id: existingCartItem.id,
				},
				data: {
					quantity: existingCartItem.quantity + 1,
				},
			});
			return NextResponse.json(updatedCartItem, { status: 200 });
		} else {
			// Create a new CartItem
			const cartItem = await prisma.cartItem.create({
				data: {
					cartId: cart.id,
					productId,
					quantity: 1,
				},
			});
			return NextResponse.json(cartItem, { status: 200 });
		}
	} catch (error) {
		console.error("Error adding product to cart:", error);
		return NextResponse.json({ error: "Error adding product to cart" }, { status: 500 });
	}
}

// Add a GET method to fetch cart items
export async function GET(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user) {
			return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
		}

		const userId = session.user.id;

		// Retrieve the user's cart items
		const cart = await prisma.cart.findFirst({
			where: { userId },
			include: {
				items: {
					include: {
						product: true,
					},
				},
			},
		});

		if (!cart || cart.items.length === 0) {
			return NextResponse.json({ items: [] }, { status: 200 });
		}

		return NextResponse.json({ items: cart.items }, { status: 200 });
	} catch (error) {
		console.error("Error fetching cart items:", error);
		return NextResponse.json({ error: "Error fetching cart items" }, { status: 500 });
	}
}

// app/api/cart/route.ts

import { NextResponse, NextRequest } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";
export async function POST(request: NextRequest) {
	try {
		const { productId } = await request.json();
		const session = await getServerSession(authOptions);
		const cookiesStore = cookies();

		let cart;

		if (session && session.user) {
			const userId = session.user.id;

			// Get or create the cart for the authenticated user
			cart = await prisma.cart.findFirst({
				where: { userId },
			});

			if (!cart) {
				cart = await prisma.cart.create({
					data: {
						userId,
					},
				});
			}
		} else {
			// For guest users
			let cartId = (await cookiesStore).get("cartId")?.value;

			if (!cartId) {
				// Generate a new cartId and set it in the cookie
				cartId = uuidv4();
				(await cookiesStore).set("cartId", cartId, { httpOnly: true, path: "/" });
			}

			// Get or create the cart for the guest user using cartId
			cart = await prisma.cart.findFirst({
				where: { id: cartId },
			});

			if (!cart) {
				cart = await prisma.cart.create({
					data: {
						id: cartId,
					},
				});
			}
		}

		// Now, add the item to the cart
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

export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		const cookiesStore = await cookies();

		let cart;

		if (session && session.user) {
			const userId = session.user.id;

			// Retrieve the user's cart
			cart = await prisma.cart.findFirst({
				where: { userId },
				include: {
					items: {
						include: {
							product: true, // Include product details
						},
					},
				},
			});
		} else {
			// For guest users
			const cartId = cookiesStore.get("cartId")?.value;

			if (!cartId) {
				return NextResponse.json({ items: [] }, { status: 200 });
			}

			// Retrieve the guest's cart
			cart = await prisma.cart.findFirst({
				where: { id: cartId },
				include: {
					items: {
						include: {
							product: true, // Include product details
						},
					},
				},
			});
		}

		if (!cart || cart.items.length === 0) {
			return NextResponse.json({ items: [] }, { status: 200 });
		}

		return NextResponse.json({ items: cart.items }, { status: 200 });
	} catch (error) {
		console.error("Error fetching cart items:", error);
		return NextResponse.json({ error: "Error fetching cart items" }, { status: 500 });
	}
}

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
			return NextResponse.json(updatedCartItem, { status: 201 });
		} else {
			// Create a new CartItem
			const cartItem = await prisma.cartItem.create({
				data: {
					cartId: cart.id,
					productId,
					quantity: 1,
				},
			});
			return NextResponse.json(cartItem, { status: 201 });
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
		let cartItems = [];

		if (session && session.user) {
			const userId = session.user.id;
			// Retrieve all carts for the authenticated user
			const carts = await prisma.cart.findMany({
				where: { userId },
				include: {
					items: {
						include: {
							product: true, // Include product details
						},
					},
				},
			});

			// Flatten the carts array into a single array of cart items
			cartItems = carts.flatMap((cart: { items: any }) => cart.items);
		} else {
			// For guest users
			const cartId = cookiesStore.get("cartId")?.value;
			if (!cartId) {
				return NextResponse.json([], { status: 200 });
			}

			// Retrieve all carts for the guest user using cartId
			const carts = await prisma.cart.findMany({
				where: { id: cartId },
				include: {
					items: {
						include: {
							product: true, // Include product details
						},
					},
				},
			});

			// Flatten the carts array into a single array of cart items
			cartItems = carts.flatMap((cart: { items: any }) => cart.items);
		}

		if (!cartItems || cartItems.length === 0) {
			return NextResponse.json([], { status: 200 });
		}

		//const orderNumber = cartItems[0].orderNumber;
		return NextResponse.json(cartItems, { status: 200 });
	} catch (error) {
		console.error("Error fetching cart items:", error);
		return NextResponse.json({ error: "Error fetching cart items" }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		const cookiesStore = await cookies();
		let cart;
		if (session && session.user) {
			const userId = session.user.id;

			// Get or create the cart for the authenticated user
			cart = await prisma.cart.findFirst({
				where: { userId },
			});

			await prisma.cart.deleteMany({
				where: {
					userId,
				},
			});
		} else {
			// For guest users
			let cartId = (await cookiesStore).get("cartId")?.value;

			await prisma.cart.delete({
				where: {
					id: cartId,
				},
			});
		}

		const url = new URL(request.url);
		if (url.searchParams.has("cartItemId")) {
			// Delete a single CartItem from the cart based on cartItemId
			const cartItemId = url.searchParams.get("cartItemId") || undefined;
			const deletionResult = await prisma.cartItem.delete({
				where: { id: cartItemId },
			});
			return new Response(JSON.stringify({ message: "Cart item removed", deletedItemsCount: deletionResult ? 1 : 0 }), { status: 201 });
		} else {
			// Correctly fetch cartId value from URL search params
			const cartId = url.searchParams.get("cartId") || undefined;
			// Delete all CartItems associated with a specific cartId
			if (!cartId) {
				return new Response(JSON.stringify({ error: "Missing cartId" }), { status: 400 });
			}
			const deletionResult = await prisma.cartItem.deleteMany({ where: { cartId } });
			return new Response(JSON.stringify({ message: "Cart cleared", deletedItemsCount: deletionResult.count }), { status: 201 });
		}
	} catch (error) {
		return new Response(JSON.stringify({ error: "Error occurred while clearing cart" }), { status: 500 });
	}
}

export async function PATCH(request: NextRequest) {
	try {
		const { cartItemId, quantityToDecrease = 1 } = await request.json();
		// Validate input data here if needed...
		const existingCartItem = await prisma.cartItem.findUnique({
			where: {
				id: cartItemId,
			},
		});
		if (!existingCartItem) {
			return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
		}
		const newQuantity = existingCartItem.quantity - quantityToDecrease;
		if (newQuantity <= 0) {
			// Delete cart item if the quantity is less than or equal to zero
			await prisma.cartItem.delete({
				where: {
					id: cartItemId,
				},
			});
			return NextResponse.json({ message: "Cart item removed" }, { status: 201 });
		} else {
			// Update cart item quantity
			const updatedCartItem = await prisma.cartItem.update({
				where: {
					id: cartItemId,
				},
				data: {
					quantity: newQuantity,
				},
			});
			return NextResponse.json(updatedCartItem, { status: 201 });
		}
	} catch (error) {
		console.error("Error updating cart item:", error);
		return NextResponse.json({ error: "Error updating cart item" }, { status: 500 });
	}
}

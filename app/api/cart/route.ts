// app/api/cart/route.ts

import { NextResponse, NextRequest } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";
export async function POST(request: NextRequest) {
	try {
		const { productId, variantId } = await request.json();
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
			const clientCartId = request.headers.get("x-cart-id");
			let cartId = clientCartId;

			if (!cartId) {
				// Generate a new cartId
				cartId = uuidv4();
			}

			// Get or create cart (still in database)
			cart = await prisma.cart.findFirst({
				where: { id: cartId },
			});

			if (!cart) {
				cart = await prisma.cart.create({
					data: { id: cartId },
				});
			}

			// Return the cartId in the response for the client to store in localStorage
			const response = NextResponse.json(cart);
			response.headers.set("x-cart-id", cart.id);
			return response;
		}

		// Now, add the item to the cart
		// Check if the product (and variant if applicable) is already in the cart
		const existingCartItem = await prisma.cartItem.findFirst({
			where: {
				cartId: cart.id,
				productId,
				variantId: variantId || null,
			},
		});

		if (existingCartItem) {
			// If the product/variant is already in the cart, increase the quantity
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
					variantId: variantId || null,
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
		let cartItems = [];

		if (session && session.user) {
			// For authenticated users - continue using user ID
			const userId = session.user.id;

			// Retrieve all carts for the authenticated user
			const carts = await prisma.cart.findMany({
				where: { userId },
				include: {
					items: {
						include: {
							product: true, // Include product details
							variant: true, // Include variant details if applicable
						},
					},
				},
			});

			// Flatten the carts array into a single array of cart items
			cartItems = carts.flatMap((cart: { items: any }) => cart.items);
		} else {
			// For guest users - get cartId from header instead of cookie
			const cartId = request.headers.get("x-cart-id");

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
							variant: true, // Include variant details if applicable
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

		return NextResponse.json(cartItems, { status: 200 });
	} catch (error) {
		console.error("Error fetching cart items:", error);
		return NextResponse.json({ error: "Error fetching cart items" }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);
		const url = new URL(request.url);

		// First, determine what we're deleting based on URL params
		if (url.searchParams.has("cartItemId")) {
			// Delete a single CartItem from the cart based on cartItemId
			const cartItemId = url.searchParams.get("cartItemId") || undefined;
			const deletionResult = await prisma.cartItem.delete({
				where: { id: cartItemId },
			});
			return new Response(
				JSON.stringify({
					message: "Cart item removed",
					deletedItemsCount: deletionResult ? 1 : 0,
				}),
				{ status: 201 }
			);
		} else {
			// Handle full cart deletion scenarios
			let cartId;

			if (session && session.user) {
				// For authenticated users
				const userId = session.user.id;

				// Get cart for the authenticated user
				const cart = await prisma.cart.findFirst({
					where: { userId },
				});
				cartId = cart?.id;

				// Delete the cart if specified
				if (url.searchParams.has("deleteCart")) {
					await prisma.cart.deleteMany({
						where: { userId },
					});
				}
			} else {
				// For guest users - get cartId from header instead of cookie
				cartId = request.headers.get("x-cart-id");

				// Delete the cart if specified
				if (url.searchParams.has("deleteCart") && cartId) {
					await prisma.cart.delete({
						where: { id: cartId },
					});

					// We don't need to clear cookies, client will handle localStorage
				}
			}

			// Use cartId from URL params if provided, otherwise use the one we determined
			const urlCartId = url.searchParams.get("cartId");
			cartId = urlCartId || cartId;

			if (!cartId) {
				return new Response(JSON.stringify({ error: "Missing cartId" }), { status: 400 });
			}

			// Delete all CartItems associated with the cart
			const deletionResult = await prisma.cartItem.deleteMany({
				where: { cartId },
			});

			// Create response with header to tell client to clear localStorage
			const response = new Response(
				JSON.stringify({
					message: "Cart cleared",
					deletedItemsCount: deletionResult.count,
				}),
				{ status: 201 }
			);

			// If we're deleting the cart completely, tell client to clear storage
			if (url.searchParams.has("deleteCart")) {
				response.headers.set("x-clear-cart", "true");
			}

			return response;
		}
	} catch (error) {
		console.error("Error occurred while clearing cart:", error);
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

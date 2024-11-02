// app/api/checkout-sessions/confirm/route.ts

import Stripe from "stripe";
import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import axios from "axios";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export async function POST(request: Request) {
	try {
		const { sessionId } = await request.json();

		if (!sessionId) {
			return NextResponse.json({ error: "No session ID provided" }, { status: 400 });
		}

		const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

		if (stripeSession.payment_status !== "paid") {
			return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
		}

		const userId = stripeSession.metadata!.userId;

		// Retrieve the user's cart and cart items
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
			return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
		}

		// Create an order
		const total = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

		const order = await prisma.order.create({
			data: {
				userId,
				total,
				status: "completed",
				items: {
					create: cart.items.map((item) => ({
						productId: item.productId,
						quantity: item.quantity,
						price: item.product.price,
					})),
				},
			},
		});

		// Send confirmation email using your existing API
		const emailResponse = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-email`, {
			body: JSON.stringify({
				to: stripeSession.customer_email!,
				from: process.env.SENDGRID_FROM_EMAIL!,
				subject: "Booking Confirmation",
				text: "Your payment was successful. Thank you for booking with us!",
				html: "<p>Your payment was successful. Thank you for booking with us!</p>",
			}),
		});

		if (!emailResponse) {
			console.error("Failed to send email:", await emailResponse);
			// Optionally handle the error, e.g., retry or log
		}

		// Clear the cart items
		await prisma.cartItem.deleteMany({
			where: { cartId: cart.id },
		});

		// Optionally, you may also delete the cart
		// await prisma.cart.delete({
		//   where: { id: cart.id },
		// });

		return NextResponse.json({ message: "Payment confirmed" }, { status: 200 });
	} catch (error) {
		console.error("Error confirming payment:", error);
		return NextResponse.json({ error: "Error confirming payment" }, { status: 500 });
	}
}

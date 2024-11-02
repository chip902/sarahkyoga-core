// app/api/checkout-sessions/route.ts

import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/prisma/client";
import { authOptions } from "../../../lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user) {
			return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
		}

		const userId = session.user.id;

		// Retrieve the user's cart and items
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

		// Prepare line items for Stripe
		const line_items = cart.items.map((item) => ({
			price_data: {
				currency: "usd",
				product_data: {
					name: item.product.name,
					description: item.product.description || "",
				},
				unit_amount: Math.round(item.product.price * 100), // Convert to cents
			},
			quantity: item.quantity,
		}));

		const success_url = `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
		const cancel_url = `${process.env.NEXT_PUBLIC_BASE_URL}/booking/checkout`;

		const stripeSession = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			mode: "payment",
			line_items,
			customer_email: session.user.email,
			success_url,
			cancel_url,
			metadata: { userId },
		});

		return NextResponse.json({ sessionId: stripeSession.id }, { status: 200 });
	} catch (error) {
		console.error("Error creating Stripe Checkout Session:", error);
		return NextResponse.json({ error: "Error creating Stripe Checkout Session" }, { status: 500 });
	}
}

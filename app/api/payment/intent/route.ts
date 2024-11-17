// app/api/payment/intent/route.ts

import Stripe from "stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	console.log("STRIPE KEY SERVER: ", process.env.STRIPE_SECRET_KEY_DEV);
	const stripe = process.env.NODE_ENV === "development" ? new Stripe(process.env.STRIPE_SECRET_KEY_DEV!) : new Stripe(process.env.STRIPE_SECRET_KEY_PROD!);

	try {
		const { amount } = await request.json();

		const paymentIntent = await stripe.paymentIntents.create({
			amount: Math.round(amount),
			currency: "usd",
			automatic_payment_methods: {
				enabled: true,
			},
		});

		return NextResponse.json({ clientSecret: paymentIntent.client_secret }, { status: 200 });
	} catch (error) {
		console.error("Error creating payment intent:", error);
		return NextResponse.json({ error: "Error creating payment intent" }, { status: 500 });
	}
}

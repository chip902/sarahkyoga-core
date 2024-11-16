import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import Stripe from "stripe";
import bcrypt from "bcryptjs";
import axios from "axios";
import { cookies } from "next/headers";
import url from "url";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_DEV!);
	const cookiesStore = cookies();

	try {
		const { paymentIntentId, registrationData, billingDetails } = await request.json();

		// Retrieve the Payment Intent to confirm status
		const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
		if (paymentIntent.status !== "succeeded") {
			return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
		}

		let userId = uuidv4();
		let cartId: string | null = null;

		// Check if the email is already registered
		let existingUser;

		try {
			existingUser = await prisma.user.findUnique({ where: { email: registrationData?.email } });
		} catch (err) {
			console.error("An error occurred during email check", err);
		}

		if (existingUser) {
			//return NextResponse.json({ warning: "Email is already registered" }, { status: 401 });
		} else if (registrationData.password) {
			// Hash the password
			const hashedPassword = await bcrypt.hash(registrationData?.password, 10);

			// Create a new user
			const newUser = await prisma.user.create({
				data: {
					email: registrationData?.email,
					password: hashedPassword,
					firstName: registrationData?.firstName,
					lastName: registrationData?.lastName,
				},
			});

			userId = newUser.id;
		} else {
			// GUEST USER
			const anonymousUserId = uuidv4();
			const guestUser = await prisma.user.create({
				data: {
					id: anonymousUserId,
					email: billingDetails.email,
					role: "guest",
				},
			});
			userId = guestUser.id;
		}

		// Get the cart ID from the cookie
		const storedCartId = (await cookiesStore).get("cartId");
		if (!storedCartId) {
			return NextResponse.json({ error: "No cart found in session" }, { status: 400 });
		}

		cartId = storedCartId.value;

		// Retrieve the existing cart items
		try {
			const cartItems = await prisma.cartItem.findMany({ where: { cartId: (await cookies()).get("cartId")?.value }, include: { product: true } });

			if (!cartItems || cartItems.length === 0) {
				console.error("No valid cart items found for the user or guest.");
				return NextResponse.json({ error: "Cart is empty" }, { status: 406 });
			}

			// Create an order
			const total = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

			try {
				await prisma.order.create({
					data: {
						userId,
						total,
						items: {
							create: cartItems.map((item) => ({
								productId: item.productId,
								quantity: item.quantity,
								price: item.product.price,
							})),
						},
					},
				});
			} catch (err) {
				console.error("Failed to create order", err);
				return NextResponse.json({ error: "Order not created" }, { status: 500 });
			}

			// Send confirmation email
			try {
				const currentUrl = new URL(request?.url || "", "https://sarahkyoga.com");
				const sendEmailEndpoint = url.resolve(currentUrl.origin, "/api/send-email");

				await axios.post(sendEmailEndpoint, {
					body: JSON.stringify({
						to: paymentIntent.receipt_email || registrationData?.email,
						from: "no-reply@sarahkyoga.com",
						subject: "Booking Confirmation",
						text: "Your payment was successful. Thank you for booking with us!",
						html: "<p>Your payment was successful. Thank you for booking with us!</p>",
					}),
				});
			} catch (emailError) {
				console.error("Failed to send email", emailError);
			}

			return NextResponse.json({ message: "Payment confirmed and order created", cartId: cartId }, { status: 201 });
		} catch (err) {
			console.error("Error confirming payment", err);
			return NextResponse.json({ error: "An unexpected error occurred while confirming the payment" }, { status: 500 });
		}
	} catch (error) {
		console.error("Error confirming payment", error);
		return NextResponse.json({ error: "An unexpected error occurred while confirming the payment" }, { status: 500 });
	}
}

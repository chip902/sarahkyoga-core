import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import Stripe from "stripe";
import bcrypt from "bcryptjs";
import axios from "axios";
import { cookies } from "next/headers";
import url from "url";
export async function POST(request: Request) {
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_DEV!);
	const cookiesStore = cookies();

	try {
		const { paymentIntentId, registrationData } = await request.json();

		// Retrieve the Payment Intent to confirm status
		const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
		if (paymentIntent.status !== "succeeded") {
			return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
		}

		let userId, guestCart;
		if (registrationData) {
			const { email, password, name } = registrationData;

			// Check if the email is already registered
			let existingUser = await prisma.user.findUnique({
				where: { email },
			});

			if (existingUser) {
				return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
			}

			// Hash the password
			const hashedPassword = await bcrypt.hash(password, 10);

			// Create a new user
			const newUser = await prisma.user.create({
				data: {
					email,
					password: hashedPassword,
					name,
				},
			});

			userId = newUser.id;
		} else {
			// Implement your logic here to retrieve the user ID from paymentIntent metadata or session
			// Example: userId = paymentIntent.metadata.userId;
		}

		// Retrieve the user's cart and cart items
		const cart = await prisma.cart.findFirst({
			where: { userId: userId },
			include: {
				items: {
					include: {
						product: true,
					},
				},
			},
		});

		if (!cart || cart.items.length === 0) {
			let cartId = (await cookiesStore).get("cartId")?.value;
			guestCart = await prisma.cart.findFirst({
				where: { id: cartId },
				include: {
					items: {
						include: {
							product: true,
						},
					},
				},
			});
		}

		// Create an order
		const total =
			cart?.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0) ||
			guestCart?.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0) ||
			0;

		if (userId) {
			await prisma.order.create({
				data: {
					userId,
					total,
					status: "completed",
					items: {
						create: cart!.items.map((item) => ({
							productId: item.productId,
							quantity: item.quantity,
							price: item.product.price,
						})),
					},
				},
			});
		} else {
			//throw new Error("userId is undefined");
		}

		if (!paymentIntentId) {
			return NextResponse.json({ error: "Payment Intent ID not provided" }, { status: 400 });
		}
		// Clear the cart items
		try {
			await prisma.cartItem.deleteMany({
				where: { cartId: cart!.id },
			});
		} catch (cartError) {
			console.error("Failed to clear cart items:", cartError);
			// Optionally handle the error
		}

		// Send confirmation email
		try {
			const currentUrl = new URL(request?.url || "", "https://sarahkyoga.com");
			console.log("CURENT_URL VALUE: ", currentUrl);
			const sendEmailEndpoint = url.resolve(currentUrl.origin, "/api/send-email");
			console.log("sendEmailEndpoint: ", sendEmailEndpoint);
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
			console.error("Failed to send email:", emailError);
			// Optionally handle the error
		}

		return NextResponse.json({ message: "Payment confirmed and order created" }, { status: 200 });
	} catch (error) {
		console.error("Error confirming payment:", error);
		return NextResponse.json({ error: "An unexpected error occurred while confirming the payment" }, { status: 500 });
	}
}

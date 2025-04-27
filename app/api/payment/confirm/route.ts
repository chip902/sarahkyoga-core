import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import Stripe from "stripe";
import bcrypt from "bcryptjs";
import axios from "axios";
import { cookies } from "next/headers";
import url from "url";
import { v4 as uuidv4 } from "uuid";
import { emailTemplates } from "@/app/templates/emailTemplates";

function generateOrderNumber() {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let result = "";
	for (let i = 0; i < 8; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}
export async function POST(request: Request) {
	const stripe =
		process.env.NODE_ENV === "development"
			? new Stripe(String(process.env.STRIPE_SECRET_KEY_DEV!))
			: new Stripe(String(process.env.STRIPE_SECRET_KEY_PROD!));
	const cookiesStore = await cookies();

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
			if (billingDetails && billingDetails.email) {
				existingUser = await prisma.user.findUnique({ where: { email: billingDetails.email } });
			}
		} catch (err) {
			console.error("An error occurred during email check", err);
			return NextResponse.json({ error: "Error checking user existence" }, { status: 500 });
		}

		if (existingUser) {
			userId = existingUser.id;
		} else if (registrationData && registrationData.password) {
			// Hash the password
			const hashedPassword = await bcrypt.hash(registrationData.password, 10);

			// Create a new user
			try {
				const newUser = await prisma.user.create({
					data: {
						email: registrationData.email,
						password: hashedPassword,
						firstName: registrationData.firstName || null,
						lastName: registrationData.lastName || null,
					},
				});

				userId = newUser.id;
			} catch (err) {
				console.error("Failed to create new user", err);
				return NextResponse.json({ error: "Error creating new user" }, { status: 500 });
			}
		} else {
			// GUEST USER
			let guestUser;

			try {
				if (billingDetails.email) {
					existingUser = await prisma.user.findUnique({ where: { email: billingDetails.email } });
					if (existingUser) {
						userId = existingUser.id;
					} else {
						const anonymousUserId = uuidv4();
						guestUser = await prisma.user.create({
							data: {
								id: anonymousUserId,
								email: billingDetails.email,
								role: "guest",
							},
						});
						userId = guestUser.id;
					}
				} else {
					console.error("No email address provided for guest user.");
					return NextResponse.json({ error: "No email address provided" }, { status: 400 });
				}
			} catch (err) {
				console.error("Failed to create or find guest user", err);
				return NextResponse.json({ error: "Error creating or finding guest user" }, { status: 500 });
			}
		}

		// Get the cart ID from the cookie
		const storedCartId = cookiesStore.get("cartId");
		if (!storedCartId) {
			return NextResponse.json({ error: "No cart found in session" }, { status: 400 });
		}

		cartId = storedCartId.value;

		// Retrieve the existing cart items
		try {
			const cartItems = await prisma.cartItem.findMany({
				where: { cartId },
				include: { product: true },
			});

			if (!cartItems || cartItems.length === 0) {
				console.error("No valid cart items found for the user or guest.");
				return NextResponse.json({ error: "Cart is empty" }, { status: 406 });
			}

			// Create an order
			const total = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
			const orderNumber = generateOrderNumber();
			let newOrder;
			let templateName;
			switch (cartItems[0].productId) {
				case "0":
					templateName = "sunday-zoom";
					break;
				case "1":
					templateName = "template-product-456";
					break;
				default:
					templateName = "default-template";
			}

			const template = emailTemplates[templateName];

			if (!template) {
				throw new Error("Template not found");
			}
			const subject = template.subject.replace("{firstName}", billingDetails.firstName);
			const textContent = template.text.replace("{firstName}", billingDetails.firstName).replace("{orderId}", orderNumber);
			const htmlContent = template.html.replace("{firstName}", billingDetails.firstName).replace("{orderId}", orderNumber);

			try {
				newOrder = await prisma.order.create({
					data: {
						userId,
						total,
						orderNumber,
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
				const currentUrl = new URL(request.url, "https://sarahkyoga.com");
				const sendEmailEndpoint = url.resolve(currentUrl.origin, "/api/send-email");

				const toEmail = paymentIntent.receipt_email || registrationData?.email || billingDetails.email;
				if (!toEmail) {
					console.error("No email address provided for sending confirmation email.");
					return NextResponse.json({ error: "No email address provided" }, { status: 400 });
				}

				const emailBody = JSON.stringify({
					to: toEmail,
					bcc: "sarah@sarahkyoga.com",
					from: "Sarah K. Yoga <noreply@sarahkyoga.com>",
					subject: subject,
					text: textContent,
					html: htmlContent,
				});

				console.log("Sending email with body:", emailBody);

				await axios.post(sendEmailEndpoint, { body: emailBody });
			} catch (emailError) {
				console.error("Failed to send email", emailError);
			}

			// Clean up the cart
			try {
				// First delete all cart items
				await prisma.cartItem.deleteMany({
					where: { cartId },
				});

				// Then delete the cart itself
				if (existingUser) {
					// For registered users
					await prisma.cart.deleteMany({
						where: { userId },
					});
				} else {
					// For guest users
					await prisma.cart.delete({
						where: { id: cartId },
					});
				}

				// Clear the cart cookie
				cookiesStore.delete("cartId");
			} catch (cleanupError) {
				console.error("Failed to clean up cart after order creation", cleanupError);
				// Still continue with the response - this is not critical enough to fail the entire transaction
			}

			return NextResponse.json({ message: "Payment confirmed and order created", cartId }, { status: 201 });
		} catch (err) {
			console.error("Error confirming payment", err);
			return NextResponse.json({ error: "An unexpected error occurred while confirming the payment" }, { status: 500 });
		}
	} catch (error) {
		console.error("Error confirming payment", error);
		return NextResponse.json({ error: "An unexpected error occurred while confirming the payment" }, { status: 500 });
	}
}

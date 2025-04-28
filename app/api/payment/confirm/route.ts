import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import Stripe from "stripe";
import bcrypt from "bcryptjs";
import axios from "axios";
import { cookies } from "next/headers";
import url from "url";
import { v4 as uuidv4 } from "uuid";
import { emailTemplates } from "@/app/templates/emailTemplates";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

	try {
		const { paymentIntentId, registrationData, billingDetails } = await request.json();
		const session = await getServerSession(authOptions);

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

		if (session && session.user) {
			// For authenticated users, find cart by userId
			const sessionUserId = session.user.id;
			let cart = await prisma.cart.findFirst({
				where: { userId: sessionUserId },
			});

			// If not found, try the userId we determined earlier (might be different)
			if (!cart && userId !== sessionUserId) {
				cart = await prisma.cart.findFirst({
					where: { userId: userId },
				});
			}

			if (!cart) {
				// Try getting cartId from header
				const headerCartId = request.headers.get("x-cart-id");
				if (headerCartId) {
					cart = await prisma.cart.findFirst({
						where: { id: headerCartId },
					});
				}
			}

			if (!cart) {
				console.error("No cart found for authenticated user:", {
					sessionUserId,
					determinedUserId: userId,
					billingEmail: billingDetails?.email,
				});
				return NextResponse.json({ error: "No cart found for user" }, { status: 400 });
			}

			cartId = cart.id;
		} else {
			// For guest users, get cartId from request header
			cartId = request.headers.get("x-cart-id");

			if (!cartId) {
				console.error("No cart found for guest user");
				return NextResponse.json({ error: "No cart found in session" }, { status: 400 });
			}
		}

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
				case "1":
					templateName = "sunday-zoom";
					break;
				case "2":
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
				const currentUrl = new URL(request.url);
				const baseUrl = `${currentUrl.protocol}//${currentUrl.host}`;

				// Create the delete URL with proper parameters
				const deleteUrl = `${baseUrl}/api/cart?cartId=${cartId}&deleteCart=true`;

				// Prepare headers object
				const headers: Record<string, string> = {
					"Content-Type": "application/json",
				};

				// For guest users, add the x-cart-id header
				if (!session || !session.user) {
					headers["x-cart-id"] = cartId;
				}

				// Call the cart deletion API
				await axios.delete(deleteUrl, { headers });
				console.log("Cart cleanup completed successfully");
			} catch (cleanupError) {
				console.error("Failed to clean up cart after order creation", cleanupError);
				// Still continue with the response - this is not critical enough to fail the entire transaction
			}

			const response = NextResponse.json(
				{
					message: "Payment confirmed and order created",
					success: true,
					shouldClearLocalStorage: true,
				},
				{ status: 201 }
			);

			// Set headers to tell client to clear cartId (for hybrid approach)
			response.headers.set("x-clear-cart", "true");

			return response;
		} catch (err) {
			console.error("Error confirming payment", err);
			return NextResponse.json({ error: "An unexpected error occurred while confirming the payment" }, { status: 500 });
		}
	} catch (error) {
		console.error("Error confirming payment", error);
		return NextResponse.json({ error: "An unexpected error occurred while confirming the payment" }, { status: 500 });
	}
}

// lib/stripe.ts
import { Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
	if (!stripePromise) {
		const publishableKey =
			process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_STRIPE_PUBLISH_KEY_DEV : process.env.NEXT_PUBLIC_STRIPE_PUBLISH_KEY_PROD;
		console.log("Publishable Key:", publishableKey); // Add this line
		if (!publishableKey) {
			console.error("Stripe publishable key is not set.");
		} else {
			stripePromise = loadStripe(publishableKey);
		}
	}
	return stripePromise;
};

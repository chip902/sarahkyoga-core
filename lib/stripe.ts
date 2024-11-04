// lib/stripe.ts
import { Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
	if (!stripePromise) {
		const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISH_KEY_DEV;
		console.log("Publishable Key:", publishableKey); // Add this line
		if (!publishableKey) {
			console.error("Stripe publishable key is not set.");
		} else {
			stripePromise = loadStripe(publishableKey);
		}
	}
	return stripePromise;
};

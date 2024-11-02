// utils/stripe.ts

import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
	if (!stripePromise) {
		stripePromise = loadStripe(process.env.STRIPE_PUBLISH_KEY_DEV!);
	}
	return stripePromise;
};

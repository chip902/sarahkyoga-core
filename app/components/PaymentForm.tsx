// components/PaymentForm.tsx
"use client";

import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { FormControl, FormLabel, Button, Box } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import useCart from "../hooks/useCart";

interface PaymentFormProps {
	isLoading: boolean;
	setIsLoading: (loading: boolean) => void;
	billingDetails: any;
	registrationData: any;
	clientSecret: string;
	handleError: (error: string | null) => void;
	promoCode?: any;
}

const PaymentForm = ({ isLoading, setIsLoading, billingDetails, registrationData, clientSecret, handleError, promoCode }: PaymentFormProps) => {
	const stripe = useStripe();
	const elements = useElements();
	const router = useRouter();
	const { clearCartStorage } = useCart();

	const handleSubmit = async (event: any) => {
		event.preventDefault();
		setIsLoading(true);

		if (!stripe || !elements) {
			setIsLoading(false);
			return;
		}

		const cardElement = elements.getElement(CardElement);

		try {
			const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
				payment_method: {
					card: cardElement!,
					billing_details: {
						name: billingDetails.firstName + " " + billingDetails.lastName,
						email: billingDetails.email,
						address: billingDetails.address,
					},
				},
			});

			if (error) {
				console.error("Payment error:", error);
				handleError(`Payment Error: ${error.message}`);
			} else if (paymentIntent && paymentIntent.status === "succeeded") {
				const cartId = localStorage.getItem("cartId");

				// Prepare headers
				const headers: Record<string, string> = {};
				if (cartId) {
					headers["x-cart-id"] = cartId;
				}
				// Handle successful payment here
				try {
					const response = await axios.post(
						"/api/payment/confirm",
						{
							paymentIntentId: paymentIntent.id,
							registrationData,
							billingDetails,
							promoCode: promoCode || null,
						},
						{ headers }
					);

					// Clear cart from localStorage on successful checkout
					if (response.data.success || response.data.shouldClearLocalStorage) {
						localStorage.removeItem("cartId");
						clearCartStorage();
					}

					// Redirect to success page
					router.push("/booking/success");
				} catch (error) {
					console.error("Checkout error:", error);
					handleError("Payment confirmed but order processing failed. Please contact support.");
				}
			}
		} catch (error) {
			console.error("Stripe confirmation error:", error);
			handleError(`Stripe Payment Confirmation Failed: ${error}`);
			router.push("/booking/checkout");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Box mt={8}>
			<form onSubmit={handleSubmit}>
				<FormControl>
					<FormLabel fontFamily="inherit">Card Details</FormLabel>
					<Box border="1px solid" borderColor="gray.300" borderRadius="md" p={2}>
						<CardElement options={{ hidePostalCode: true }} />
					</Box>
				</FormControl>
				<Button colorScheme="blue" size="lg" mt={6} w="full" type="submit" isLoading={isLoading} fontFamily="inherit">
					Reserve Now!
				</Button>
			</form>
		</Box>
	);
};

export default PaymentForm;

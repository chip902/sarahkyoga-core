// components/PaymentForm.tsx
"use client";

import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { FormControl, FormLabel, Button, Box } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import useCart from "../hooks/useCart";

interface PaymentFormProps {
	isLoading: boolean;
	setIsLoading: (loading: boolean) => void;
	billingDetails: any;
	registrationData: any;
	clientSecret: string;
	handleError: (error: string | null) => void;
}

const PaymentForm = ({ isLoading, setIsLoading, billingDetails, registrationData, clientSecret, handleError }: PaymentFormProps) => {
	const stripe = useStripe();
	const elements = useElements();
	const router = useRouter();
	const { clearCart } = useCart();

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
						name: billingDetails.name,
						email: billingDetails.email,
						address: billingDetails.address,
					},
				},
			});

			if (error) {
				console.error("Payment error:", error);
				handleError(`Payment Error: ${error.message}`);
			} else if (paymentIntent && paymentIntent.status === "succeeded") {
				// Handle successful payment here
				try {
					let response;
					if (registrationData) {
						response = await axios.post("/api/payment/confirm", {
							paymentIntentId: paymentIntent.id,
							registrationData,
							clientSecret,
						});
					} else {
						response = await axios.post("/api/payment/confirm", {
							paymentIntentId: paymentIntent.id,
							clientSecret,
							billingDetails,
						});
					}
					// use the response as needed...
				} catch (err) {
					console.error("API Error:", err);
					handleError(`Server Error - Payment Confirmation Failed: ${err}`);
				}
			}
		} catch (error) {
			console.error("Stripe confirmation error:", error);
			handleError(`Stripe Payment Confirmation Failed: ${error}`);
		} finally {
			setIsLoading(false);
			clearCart();
			router.push("/booking/success");
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
					Place Order
				</Button>
			</form>
		</Box>
	);
};

export default PaymentForm;

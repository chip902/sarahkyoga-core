// components/PaymentForm.tsx
"use client";

import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { FormControl, FormLabel, Button, Box } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface PaymentFormProps {
	isLoading: boolean;
	setIsLoading: (loading: boolean) => void;
	billingDetails: any;
	registrationData: any;
	clientSecret: string;
}

const PaymentForm = ({ isLoading, setIsLoading, billingDetails, registrationData, clientSecret }: PaymentFormProps) => {
	const stripe = useStripe();
	const elements = useElements();
	const router = useRouter();

	const handleSubmit = async (event: any) => {
		event.preventDefault();
		setIsLoading(true);

		if (!stripe || !elements) {
			setIsLoading(false);
			return;
		}

		const cardElement = elements.getElement(CardElement);

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
			setIsLoading(false);
		} else if (paymentIntent && paymentIntent.status === "succeeded" && registrationData.password) {
			// Handle successful payment here
			await axios.post("/api/payment/confirm", {
				paymentIntentId: paymentIntent.id,
				registrationData,
				clientSecret,
			});

			// Redirect or display success message
			router.push("/booking/success");
		} else if (paymentIntent && paymentIntent.status === "succeeded") {
			await axios.post("/api/payment/confirm", {
				paymentIntentId: paymentIntent.id,
				clientSecret,
			});

			// Redirect or display success message
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

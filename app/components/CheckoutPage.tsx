"use client";

import { getStripe } from "@/lib/stripe";
import {
	useColorModeValue,
	Box,
	Heading,
	Flex,
	Text,
	Stack,
	Divider,
	FormControl,
	FormLabel,
	Input,
	Checkbox,
	Skeleton,
	Center,
	Container,
	useToast,
} from "@chakra-ui/react";
import { CartItem, Product } from "@prisma/client";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions } from "@stripe/stripe-js";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import PaymentForm from "./PaymentForm";
import useCart from "../hooks/useCart";

interface CartItemWithProduct extends CartItem {
	product: Product;
}

const CheckoutPage = () => {
	const { data: session } = useSession();
	const toast = useToast();
	const [regState, setRegState] = useState(false);
	const { cartItems } = useCart();

	const [registrationData, setRegistrationData] = useState({
		email: "",
		password: "",
		name: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null);

	const [clientSecret, setClientSecret] = useState("");
	const [billingDetails, setBillingDetails] = useState({
		name: "",
		email: "",
		address: {
			line1: "",
			city: "",
			state: "",
			postal_code: "",
			country: "US",
		},
	});
	useEffect(() => {
		if (apiError) {
			toast({ title: "An error occurred.", description: apiError, status: "error", duration: 5000, isClosable: true });
		}
	}, [apiError]);
	// Fetch cart items and create Payment Intent
	useEffect(() => {
		if (Array.isArray(cartItems) && cartItems.length > 0) {
			const total = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
			// Create Payment Intent
			axios
				.post("/api/payment/intent", {
					amount: total * 100, // Convert to cents
				})
				.then((response) => setClientSecret(response.data.clientSecret))
				.catch((error) => console.error("Error creating payment intent:", error));
		}
	}, [cartItems]);

	// Calculate total
	const total = cartItems?.length ? cartItems.reduce((acc: number, item: CartItemWithProduct) => acc + item.product.price * item.quantity, 0) : 0;

	// Get the stripePromise from getStripe
	const stripePromise = getStripe();
	// Stripe Elements options
	const options: StripeElementsOptions = {
		clientSecret,
	};

	// Styling variables
	const bgColor = useColorModeValue("white", "brand.600");
	const boxShadow = useColorModeValue("lg", "dark-lg");

	if (!clientSecret) {
		return (
			<Container maxW="800px" my={{ sm: 100 }} px={4}>
				<Skeleton w="800px" h="1200px" />
			</Container>
		);
	}

	return (
		<Box maxW="800px" mx="auto" my={{ sm: 100, md: 400 }} px={4}>
			<Flex direction={{ sm: "column" }} bg={bgColor} boxShadow={boxShadow} borderRadius="md" p={8}>
				{/* Order Summary */}
				<Box flex={{ sm: "0", md: 1 }} mb={{ md: 8, lg: 0 }}>
					<Heading fontFamily="inherit" size="lg" mb={6}>
						Order Summary
					</Heading>
					{cartItems.length > 0 ? (
						<Stack spacing={4}>
							{cartItems.map((item: CartItemWithProduct) => (
								<Box key={item.id} p={4} borderWidth="1px" borderRadius="md">
									<Text fontWeight="bold" fontSize="lg">
										{item.product.name}
									</Text>
									<Text>Quantity: {item.quantity}</Text>
									<Text>Price: ${item.product.price.toFixed(2)} each</Text>
								</Box>
							))}
							<Divider />
							<Text fontWeight="bold" fontSize="xl">
								Total: ${total.toFixed(2)}
							</Text>
						</Stack>
					) : (
						<Text>Your cart is empty.</Text>
					)}
				</Box>

				{/* Payment and Billing Details */}
				<Box flex={{ sm: "0 0 100%", md: 1 }} mb={4}>
					<Heading fontFamily="inherit" size="md" mb={6}>
						Billing Details
					</Heading>
					<Stack spacing={4}>
						{/* Billing Address Form */}
						<Box mb={{ base: 4, md: 2 }}>
							<FormControl isRequired>
								<FormLabel fontFamily="inherit">Name</FormLabel>
								<Input
									type="text"
									value={billingDetails.name}
									onChange={(e) => setBillingDetails({ ...billingDetails, name: e.target.value })}
								/>
							</FormControl>
						</Box>
						<Box mb={{ base: 4, md: 2 }}>
							<FormControl isRequired>
								<FormLabel fontFamily="inherit">Email</FormLabel>
								<Input
									type="email"
									value={billingDetails.email}
									onChange={(e) => setBillingDetails({ ...billingDetails, email: e.target.value })}
								/>
							</FormControl>
						</Box>
						<Checkbox isChecked={regState} onChange={() => setRegState(!regState)}>
							Would you like to make an account?
						</Checkbox>
						{regState && (
							<Box mb={{ base: 4, md: 2 }}>
								<FormControl isRequired>
									<FormLabel>Password</FormLabel>
									<Input
										type="password"
										value={registrationData.password}
										onChange={(e) =>
											setRegistrationData({
												...registrationData,
												password: e.target.value,
											})
										}
									/>
								</FormControl>
							</Box>
						)}
						<Box mb={{ base: 4, md: 2 }}>
							<FormControl isRequired>
								<FormLabel fontFamily="inherit">Address Line 1</FormLabel>
								<Input
									type="text"
									value={billingDetails.address.line1}
									onChange={(e) =>
										setBillingDetails({
											...billingDetails,
											address: { ...billingDetails.address, line1: e.target.value },
										})
									}
								/>
							</FormControl>
						</Box>
						<Box mb={{ base: 4, md: 2 }}>
							<FormControl>
								<FormLabel fontFamily="inherit">City</FormLabel>
								<Input
									type="text"
									value={billingDetails.address.city}
									onChange={(e) =>
										setBillingDetails({
											...billingDetails,
											address: { ...billingDetails.address, city: e.target.value },
										})
									}
								/>
							</FormControl>
						</Box>
						<Box mb={{ base: 4, md: 2 }}>
							<FormControl>
								<FormLabel fontFamily="inherit">State</FormLabel>
								<Input
									type="text"
									value={billingDetails.address.state}
									onChange={(e) =>
										setBillingDetails({
											...billingDetails,
											address: { ...billingDetails.address, state: e.target.value },
										})
									}
								/>
							</FormControl>
						</Box>
						<Box mb={{ base: 4, md: 2 }}>
							<FormControl isRequired>
								<FormLabel fontFamily="inherit">Postal Code</FormLabel>
								<Input
									type="text"
									value={billingDetails.address.postal_code}
									onChange={(e) =>
										setBillingDetails({
											...billingDetails,
											address: { ...billingDetails.address, postal_code: e.target.value },
										})
									}
								/>
							</FormControl>
						</Box>
						<Box mb={{ base: 4, md: 2 }}>
							{/* Payment Form */}
							{clientSecret && (
								<Elements stripe={stripePromise} options={options}>
									<PaymentForm
										isLoading={isLoading}
										setIsLoading={setIsLoading}
										billingDetails={billingDetails}
										registrationData={registrationData.password ? registrationData : null}
										clientSecret={clientSecret}
										handleError={setApiError}
									/>
								</Elements>
							)}
						</Box>
					</Stack>
				</Box>
			</Flex>
		</Box>
	);
};

export default CheckoutPage;

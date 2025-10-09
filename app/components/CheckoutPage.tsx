"use client";

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
	Container,
	useToast,
	Button,
} from "@chakra-ui/react";
import { CartItem, Product, ProductVariant } from "@/app/generated/prisma/client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import axios from "axios";
import { useState, useEffect } from "react";
import PaymentForm from "./PaymentForm";
import useCart from "../hooks/useCart";

interface CartItemWithProduct extends CartItem {
	quantity: any;
	product: Product;
	variant?: ProductVariant | null;
}

const CheckoutPage = () => {
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

	// Promo code state
	const [promoCode, setPromoCode] = useState("");
	const [appliedPromoCode, setAppliedPromoCode] = useState<any>(null);
	const [promoCodeError, setPromoCodeError] = useState<string | null>(null);
	const [isValidatingPromo, setIsValidatingPromo] = useState(false);

	const [clientSecret, setClientSecret] = useState("");
	const [billingDetails, setBillingDetails] = useState({
		firstName: "",
		lastName: "",
		email: "",
		address: {
			line1: "",
			city: "",
			state: "",
			postal_code: "",
			country: "US",
		},
	});
	// Handle promo code validation and application
	const handleApplyPromoCode = async () => {
		if (!promoCode.trim()) {
			setPromoCodeError("Please enter a promo code");
			return;
		}

		setIsValidatingPromo(true);
		setPromoCodeError(null);

		try {
			const response = await axios.post("/api/promo-code/validate", {
				code: promoCode.trim(),
				total: total,
			});

			if (response.data.valid) {
				setAppliedPromoCode(response.data);
				toast({
					title: "Promo code applied!",
					description: `You saved $${response.data.discountAmount.toFixed(2)}`,
					status: "success",
					duration: 3000,
					isClosable: true,
				});
			}
		} catch (error: any) {
			const errorMessage = error.response?.data?.error || "Invalid promo code";
			setPromoCodeError(errorMessage);
			setAppliedPromoCode(null);
		} finally {
			setIsValidatingPromo(false);
		}
	};

	const handleRemovePromoCode = () => {
		setAppliedPromoCode(null);
		setPromoCode("");
		setPromoCodeError(null);
	};

	// Handle free order completion (no payment required)
	const handleFreeOrderComplete = async () => {
		setIsLoading(true);
		try {
			// Get cart ID
			const cartId = localStorage.getItem("cartId");
			const headers: Record<string, string> = {
				"Content-Type": "application/json",
			};
			if (cartId) {
				headers["x-cart-id"] = cartId;
			}

			// Create order directly without payment
			const response = await axios.post(
				"/api/payment/confirm",
				{
					paymentIntentId: "free-order", // Special indicator for free orders
					registrationData: registrationData.password ? registrationData : null,
					billingDetails,
					promoCode: appliedPromoCode?.promoCode || null,
				},
				{ headers }
			);

			if (response.data.success) {
				// Clear cart
				localStorage.removeItem("cartId");
				toast({
					title: "Order placed successfully!",
					description: "Your free order has been confirmed.",
					status: "success",
					duration: 5000,
					isClosable: true,
				});
				// Redirect to success page
				window.location.href = "/booking/success";
			}
		} catch (error: any) {
			const errorMessage = error.response?.data?.error || "Failed to complete order";
			setApiError(errorMessage);
			toast({
				title: "Error",
				description: errorMessage,
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (apiError) {
			toast({ title: "An error occurred.", description: apiError, status: "error", duration: 5000, isClosable: true });
		}
	}, [apiError]);
	// Fetch cart items and create Payment Intent
	useEffect(() => {
		if (Array.isArray(cartItems) && cartItems.length > 0) {
			const cartTotal = cartItems.reduce((acc, item) => {
				const price = item.variant ? item.variant.price : item.product.price;
				return acc + price * item.quantity;
			}, 0);
			const finalTotal = appliedPromoCode ? appliedPromoCode.newTotal : cartTotal;

			// Only create payment intent if total is greater than $0.50 (Stripe minimum)
			if (finalTotal >= 0.5) {
				axios
					.post("/api/payment/intent", {
						amount: Math.round(finalTotal * 100), // Convert to cents and round
					})
					.then((response) => setClientSecret(response.data.clientSecret))
					.catch((error) => console.error("Error creating payment intent:", error));
			} else {
				// For free orders, set a special flag instead of creating payment intent
				setClientSecret("free-order");
			}
		}
	}, [cartItems, appliedPromoCode]);

	// Calculate total (use variant price if available, otherwise use product price)
	const total = cartItems?.length
		? cartItems.reduce((acc: number, item: CartItemWithProduct) => {
				const price = item.variant ? item.variant.price : item.product.price;
				return acc + price * item.quantity;
		  }, 0)
		: 0;
	// Get the stripePromise from loadStripe
	const stripePromise = loadStripe(
		process.env.NODE_ENV == "development" ? String(process.env.NEXT_PUBLIC_STRIPE_PUBLISH_KEY_DEV!) : String(process.env.STRIPE_PUBLISH_KEY_PROD!)
	);
	// Check if this is a free order
	const isFreeOrder = clientSecret === "free-order";
	const finalTotal = appliedPromoCode ? appliedPromoCode.newTotal : total;

	// Stripe Elements options (only needed for paid orders)
	const options: StripeElementsOptions = {
		clientSecret: isFreeOrder ? "" : clientSecret,
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
							{cartItems.map((item: CartItemWithProduct) => {
								const itemPrice = item.variant ? item.variant.price : item.product.price;
								const itemName = item.variant ? `${item.product.name} - ${item.variant.name}` : item.product.name;

								return (
									<Box key={item.id} p={4} borderWidth="1px" borderRadius="md">
										<Text fontWeight="bold" fontSize="lg">
											{itemName}
										</Text>
										<Text>Quantity: {item.quantity}</Text>
										<Text>Price: ${itemPrice.toFixed(2)} each</Text>
									</Box>
								);
							})}
							<Divider />
							<Text fontWeight="bold" fontSize="lg">
								Subtotal: ${total.toFixed(2)}
							</Text>

							{appliedPromoCode && (
								<>
									<Flex justifyContent="space-between" alignItems="center" color="green.500">
										<Text fontWeight="semibold">Discount ({appliedPromoCode.promoCode.code}):</Text>
										<Text fontWeight="semibold">-${appliedPromoCode.discountAmount.toFixed(2)}</Text>
									</Flex>
								</>
							)}

							<Divider />
							<Text fontWeight="bold" fontSize="xl">
								Total: ${appliedPromoCode ? appliedPromoCode.newTotal.toFixed(2) : total.toFixed(2)}
							</Text>
						</Stack>
					) : (
						<Text>Your cart is empty.</Text>
					)}

					{/* Promo Code Section */}
					<Box mt={6} p={4} mb={6} borderWidth="1px" borderRadius="md">
						<Heading fontFamily="inherit" size="sm" mb={3}>
							Have a Promo Code?
						</Heading>
						{!appliedPromoCode ? (
							<>
								<Flex gap={2}>
									<Input
										placeholder="Enter promo code"
										value={promoCode}
										onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
										onKeyDown={(e) => e.key === "Enter" && handleApplyPromoCode()}
										isDisabled={isValidatingPromo}
									/>
									<Button colorScheme="blue" onClick={handleApplyPromoCode} isLoading={isValidatingPromo} loadingText="Validating">
										Apply
									</Button>
								</Flex>
								{promoCodeError && (
									<Text color="red.500" fontSize="sm" mt={2}>
										{promoCodeError}
									</Text>
								)}
							</>
						) : (
							<Flex justifyContent="space-between" alignItems="center">
								<Text color="green.500" fontWeight="semibold">
									✓ Code {appliedPromoCode.promoCode.code} applied
								</Text>
								<Button size="sm" variant="ghost" colorScheme="red" onClick={handleRemovePromoCode}>
									Remove
								</Button>
							</Flex>
						)}
					</Box>
				</Box>

				{/* Payment and Billing Details */}
				<Box flex={{ sm: "0 0 100%", md: 1 }} mb={4}>
					<Heading fontFamily="inherit" size="md" mb={6}>
						Billing Details
					</Heading>
					<Stack spacing={4}>
						{/* Billing Address Form */}
						<Flex mb={{ base: 4, md: 2 }} justifyContent="space-between">
							<FormControl isRequired width="50%" mr={2}>
								<FormLabel fontFamily="inherit">First Name</FormLabel>
								<Input
									type="text"
									value={billingDetails.firstName}
									onChange={(e) => setBillingDetails({ ...billingDetails, firstName: e.target.value })}
								/>
							</FormControl>
							<FormControl isRequired width="50%" ml={2}>
								<FormLabel fontFamily="inherit">Last Name</FormLabel>
								<Input
									type="text"
									value={billingDetails.lastName}
									onChange={(e) => setBillingDetails({ ...billingDetails, lastName: e.target.value })}
								/>
							</FormControl>
						</Flex>
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
							{isFreeOrder ? (
								// Show simple button for free orders
								<Box>
									<Text fontSize="lg" fontWeight="bold" color="green.500" mb={4}>
										🎉 Your order is FREE!
									</Text>
									<Button
										colorScheme="green"
										size="lg"
										width="100%"
										onClick={handleFreeOrderComplete}
										isLoading={isLoading}
										loadingText="Processing...">
										Complete Free Order
									</Button>
								</Box>
							) : (
								// Show Stripe payment form for paid orders
								<Elements stripe={stripePromise} options={options}>
									{/* Payment Form */}
									{clientSecret && (
										<PaymentForm
											isLoading={isLoading}
											setIsLoading={setIsLoading}
											billingDetails={billingDetails}
											registrationData={registrationData.password ? registrationData : null}
											clientSecret={clientSecret}
											handleError={setApiError}
											promoCode={appliedPromoCode?.promoCode || null}
										/>
									)}
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

// app/booking/checkout/page.tsx
"use client";
import { Button, Divider, Heading, HStack, Icon, Input, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { HiOutlineChat, HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import ProductItem from "../ProductItem";
import { useEffect, useState } from "react";
import axios from "axios";
import { CartItem, Product } from "@prisma/client";
import { getStripe } from "../../../lib/stripe";

const stripePromise = getStripe();

type CartItemWithProduct = CartItem & { product: Product };

const OrderSummary = () => {
	const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchCartItems = async () => {
			try {
				const response = await axios.get("/api/cart");
				setCartItems(response.data.items);
			} catch (error) {
				console.error("Failed to fetch cart items:", error);
			}
		};

		fetchCartItems();
	}, []);

	const handlePlaceOrder = async () => {
		setIsLoading(true);
		try {
			const response = await axios.post("/api/checkout_sessions");

			if (response.status === 200) {
				const { sessionId } = response.data;
				const stripe = await stripePromise;
				const { error } = await stripe!.redirectToCheckout({ sessionId });

				if (error) {
					console.error("Stripe redirect error:", error);
				}
			} else {
				console.error("Error creating Stripe Checkout Session");
			}
		} catch (error) {
			console.error("Error placing order:", error);
		}
		setIsLoading(false);
	};

	// Calculate totals
	const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

	// For simplicity, set shipping cost and discount to zero
	const shippingCost = 0;
	const discount = 0;

	const total = subtotal + shippingCost - discount;

	return (
		<Stack spacing={{ base: "6", md: "10" }}>
			<Heading size="md">Order Summary</Heading>
			<Stack spacing="8">
				<Stack spacing="6">
					{cartItems.map((item) => (
						<div key={item.id}>
							<ProductItem product={item.product} quantity={item.quantity} />
							<Divider />
						</div>
					))}
				</Stack>

				<HStack spacing="6">
					<Input
						name="discount"
						placeholder="Discount Code"
						focusBorderColor={useColorModeValue("brand.500", "brand.200")}
						bg={useColorModeValue("white", "gray.700")}
						size="lg"
					/>
					<Button
						size="lg"
						px="8"
						bg={useColorModeValue("gray.500", "gray.600")}
						_hover={{ bg: useColorModeValue("gray.600", "gray.500") }}
						_active={{ bg: useColorModeValue("gray.700", "gray.500") }}
						color="white">
						Apply
					</Button>
				</HStack>
				<Stack spacing="6">
					<Stack spacing="3">
						<Stack direction="row" justify="space-between">
							<Text color={useColorModeValue("gray.600", "gray.300")}>Subtotal</Text>
							<Text color={useColorModeValue("black", "white")}>${subtotal.toFixed(2)}</Text>
						</Stack>
						<Stack direction="row" justify="space-between">
							<Text color={useColorModeValue("gray.600", "gray.300")}>Shipping cost</Text>
							<Text color={useColorModeValue("black", "white")}>+${shippingCost.toFixed(2)}</Text>
						</Stack>
						<Stack direction="row" justify="space-between">
							<Text color={useColorModeValue("gray.600", "gray.300")}>Discount</Text>
							<Text color={useColorModeValue("brand.500", "brand.200")}>-${discount.toFixed(2)}</Text>
						</Stack>
					</Stack>
					<Divider />
					<Stack direction="row" justify="space-between">
						<Text fontSize="lg" fontWeight="semibold" color={useColorModeValue("gray.700", "gray.200")}>
							Order Total
						</Text>
						<Text fontSize="xl" fontWeight="semibold" color={useColorModeValue("black", "white")}>
							${total.toFixed(2)}
						</Text>
					</Stack>
				</Stack>
			</Stack>
			<Stack spacing="8">
				<Button colorScheme="brand" size="lg" py="7" onClick={handlePlaceOrder} isLoading={isLoading}>
					Place Order
				</Button>
				<Stack spacing="3">
					<Text fontSize="sm" color={useColorModeValue("gray.700", "gray.200")}>
						Have questions? or Need help to complete your order?
					</Text>
					<HStack spacing="8" color={useColorModeValue("brand.500", "brand.200")} fontWeight="semibold">
						<HStack>
							<Icon as={HiOutlineChat} boxSize="5" />
							<Text>Live Chat</Text>
						</HStack>
						<HStack>
							<Icon as={HiOutlinePhone} boxSize="5" />
							<Text>Phone</Text>
						</HStack>
						<HStack>
							<Icon as={HiOutlineMail} boxSize="5" />
							<Text>Email</Text>
						</HStack>
					</HStack>
				</Stack>
			</Stack>
		</Stack>
	);
};
export default OrderSummary;

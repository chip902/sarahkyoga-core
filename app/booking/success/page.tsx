// app/booking/success/page.tsx
"use client";

import { Suspense, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Box, Flex, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import useCart from "@/app/hooks/useCart";

const SuccessPage = () => {
	const bgColor = useColorModeValue("white", "brand.600");
	const boxShadow = useColorModeValue("lg", "dark-lg");
	const params = useParams();
	const sessionId = params?.session_id;
	const { clearCart } = useCart();

	// useEffect(() => {
	// 	const confirmOrder = async () => {
	// 		if (sessionId) {
	// 			try {
	// 				const response = await axios.post("/api/payment/confirm", { sessionId });

	// 				if (response.status === 201 && response.data.cartId) {
	// 					console.log("Payment confirmed");

	// 					// Ensure clearCart is defined before using it and cartId is returned in the response data
	// 					if (typeof clearCart === "function") {
	// 						clearCart(response.data.cartId);
	// 					} else {
	// 						console.error("clearCart function not defined");
	// 					}
	// 				} else {
	// 					console.error("Missing cartID in response data or payment confirmation failed");
	// 				}
	// 			} catch (error) {
	// 				console.error("Error confirming payment:", error);
	// 			}
	// 		}
	// 	};

	// 	confirmOrder();
	// }, [sessionId]);

	return (
		<Suspense>
			<Flex direction={{ sm: "column" }} bg={bgColor} boxShadow={boxShadow} borderRadius="md" p={8} my={{ sm: 100, md: 400 }} mx="7%">
				{/* Order Summary */}
				<Box flex={{ sm: "0", md: 1 }} mb={{ md: 8, lg: 0 }}>
					<Heading mb={4}>Thank You for Your Purchase!</Heading>
					<Text>Your order has been placed successfully.</Text>
				</Box>
			</Flex>
		</Suspense>
	);
};

export default SuccessPage;

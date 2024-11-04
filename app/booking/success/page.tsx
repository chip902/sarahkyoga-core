// app/booking/success/page.tsx

"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Box, Heading, Text } from "@chakra-ui/react";

const SuccessPage = () => {
	const searchParams = useSearchParams();
	const sessionId = searchParams?.get("session_id");

	useEffect(() => {
		const confirmOrder = async () => {
			if (sessionId) {
				try {
					const response = await axios.post("/api/checkout-sessions/confirm", {
						sessionId,
					});

					if (response.status === 200) {
						console.log("Payment confirmed");
					} else {
						console.error("Error confirming payment");
					}
				} catch (error) {
					console.error("Error confirming payment:", error);
				}
			}
		};
		confirmOrder();
	}, [sessionId]);

	return (
		<Box maxW="600px" mx="auto" py={8}>
			<Heading mb={4}>Thank You for Your Purchase!</Heading>
			<Text>Your order has been placed successfully.</Text>
		</Box>
	);
};

export default SuccessPage;

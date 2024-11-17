// app/booking/success/page.tsx
"use client";
import { Suspense } from "react";

import { Box, Flex, Heading, Text, useColorModeValue } from "@chakra-ui/react";

const SuccessPage = () => {
	const bgColor = useColorModeValue("white", "brand.600");
	const boxShadow = useColorModeValue("lg", "dark-lg");

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

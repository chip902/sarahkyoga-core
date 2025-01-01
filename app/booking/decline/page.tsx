// app/booking/success/page.tsx
"use client";
import { Suspense } from "react";

import { Box, Flex, Heading, Text } from "@chakra-ui/react";

const SuccessPage = () => {
	return (
		<Suspense>
			<Flex direction={{ sm: "column" }} bg="brand.500" shadow="lg" borderRadius="md" p={8} my={{ sm: 100, md: 400 }} mx="7%">
				{/* Order Summary */}
				<Box flex={{ sm: "0", md: 1 }} mb={{ md: 8, lg: 0 }}>
					<Heading mb={4}>Something went wrong...</Heading>
					<Text>Please check your payment info and try again.</Text>
				</Box>
			</Flex>
		</Suspense>
	);
};

export default SuccessPage;

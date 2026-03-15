"use client";

import { Box } from "@chakra-ui/react";

export default function Home() {
	return (
		<Box
			minH="calc(100vh - 80px)"
			w="100%"
			backgroundImage="url('/background.jpg')"
			backgroundPosition="12% 18%"
			backgroundRepeat="no-repeat"
			backgroundSize="cover"
		/>
	);
}

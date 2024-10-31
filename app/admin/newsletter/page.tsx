"use client";

import NewsletterDashboard from "@/app/components/newsletter/NewsletterDashboard";
import { Box, Container } from "@chakra-ui/react";

export default function NewsletterPage() {
	return (
		<Container maxW="container.xl" my="300px">
			<Box bg="white" p={6} borderRadius="lg" shadow="sm">
				<NewsletterDashboard />
			</Box>
		</Container>
	);
}

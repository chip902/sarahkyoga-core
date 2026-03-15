"use client";

import { Box, Container, SimpleGrid, Text, Link, VStack, HStack } from "@chakra-ui/react";
import NextLink from "next/link";
import NewsletterSubscription from "./newsletter/NewsletterSubscription";

export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<Box as="footer" bg="gray.900" color="white" py={12} mt="auto">
			<Container maxW="container.xl">
				<SimpleGrid columns={[1, 1, 2, 4]} spacing={8} mb={8}>
					{/* Newsletter Section */}
					<Box gridColumn={["1", "1", "span 2", "span 2"]}>
						<NewsletterSubscription />
					</Box>

					{/* Quick Links */}
					<VStack align="start" spacing={3}>
						<Text fontWeight="bold" fontSize="lg" color="white" letterSpacing="wide">
							Quick Links
						</Text>
						<Link as={NextLink} href="/" color="gray.400" _hover={{ color: "white" }}>
							Home
						</Link>
						<Link as={NextLink} href="/classes" color="gray.400" _hover={{ color: "white" }}>
							Classes
						</Link>
						<Link as={NextLink} href="/workshops" color="gray.400" _hover={{ color: "white" }}>
							Workshops
						</Link>
						<Link as={NextLink} href="/about" color="gray.400" _hover={{ color: "white" }}>
							About
						</Link>
						<Link as={NextLink} href="/contact" color="gray.400" _hover={{ color: "white" }}>
							Contact
						</Link>
					</VStack>

					{/* Contact Info */}
					<VStack align="start" spacing={3}>
						<Text fontWeight="bold" fontSize="lg" color="white" letterSpacing="wide">
							Contact
						</Text>
						<Text color="gray.400" fontSize="sm">
							Sarah K. Yoga
						</Text>
						<Text color="gray.400" fontSize="sm">
							sarah@sarahkyoga.com
						</Text>
						<Link href="https://instagram.com/sarahkyoga" color="gray.400" _hover={{ color: "white" }} target="_blank" rel="noopener noreferrer">
							Instagram
						</Link>
					</VStack>
				</SimpleGrid>

				{/* Copyright */}
				<Box borderTop="1px" borderColor="gray.700" pt={6}>
					<HStack justify="space-between" wrap="wrap" spacing={4}>
						<Text color="gray.500" fontSize="sm">
							© {currentYear} Sarah K. Yoga. All rights reserved.
						</Text>
						<Link as={NextLink} href="/privacy-policy" color="gray.500" fontSize="sm" _hover={{ color: "gray.300" }}>
							Privacy Policy
						</Link>
					</HStack>
				</Box>
			</Container>
		</Box>
	);
}

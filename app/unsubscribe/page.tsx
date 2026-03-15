"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Box, Button, Container, Heading, Text, VStack, useToast } from "@chakra-ui/react";

function UnsubscribeContent() {
	const searchParams = useSearchParams();
	const token = searchParams?.get("token") ?? null;
	const toast = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [isUnsubscribed, setIsUnsubscribed] = useState(false);

	const handleUnsubscribe = async () => {
		setIsLoading(true);
		try {
			const response = await fetch("/api/newsletter/unsubscribe", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to unsubscribe");
			}

			setIsUnsubscribed(true);
		} catch (error) {
			toast({
				title: "Error",
				description: error instanceof Error ? error.message : "Something went wrong",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	if (!token) {
		return (
			<Container maxW="lg" py={20}>
				<Box bg="white" p={8} borderRadius="xl" textAlign="center">
					<Heading size="md" mb={4}>
						Invalid Unsubscribe Link
					</Heading>
					<Text color="gray.600">This unsubscribe link appears to be invalid or has expired.</Text>
				</Box>
			</Container>
		);
	}

	if (isUnsubscribed) {
		return (
			<Container maxW="lg" py={20}>
				<Box bg="white" p={8} borderRadius="xl" textAlign="center">
					<Heading size="md" mb={4}>
						Unsubscribed
					</Heading>
					<Text color="gray.600">You have been successfully unsubscribed from the Sarah K Yoga newsletter.</Text>
					<Text color="gray.500" fontSize="sm" mt={4}>
						You can resubscribe at any time from the footer of our website.
					</Text>
				</Box>
			</Container>
		);
	}

	return (
		<Container maxW="lg" py={20}>
			<Box bg="white" p={8} borderRadius="xl" textAlign="center">
				<VStack spacing={4}>
					<Heading size="md">Unsubscribe from Newsletter</Heading>
					<Text color="gray.600">Are you sure you want to unsubscribe from the Sarah K Yoga newsletter?</Text>
					<Button colorScheme="red" onClick={handleUnsubscribe} isLoading={isLoading}>
						Yes, Unsubscribe
					</Button>
				</VStack>
			</Box>
		</Container>
	);
}

export default function UnsubscribePage() {
	return (
		<Suspense
			fallback={
				<Container maxW="lg" py={20}>
					<Box bg="white" p={8} borderRadius="xl" textAlign="center">
						<Text color="gray.600">Loading...</Text>
					</Box>
				</Container>
			}>
			<UnsubscribeContent />
		</Suspense>
	);
}

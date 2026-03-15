"use client";

import { useEffect, useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Text, VStack, useToast, Checkbox, Heading } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

export default function NewsletterSubscription() {
	const { data: session } = useSession();
	const toast = useToast();
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [optIn, setOptIn] = useState(false);
	const [isPreferenceLoading, setIsPreferenceLoading] = useState(false);

	useEffect(() => {
		const fetchPreference = async () => {
			if (!session?.user) {
				setOptIn(false);
				return;
			}

			setIsPreferenceLoading(true);

			try {
				const response = await fetch("/api/user/newsletter-preference");

				if (!response.ok) {
					throw new Error("Failed to load newsletter preference");
				}

				const data: { newsletterOptIn?: boolean } = await response.json();
				setOptIn(Boolean(data.newsletterOptIn));
			} catch (error) {
				toast({
					title: "Error",
					description: error instanceof Error ? error.message : "Failed to load newsletter preference",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
			} finally {
				setIsPreferenceLoading(false);
			}
		};

		void fetchPreference();
	}, [session?.user, toast]);

	const handleSubscribe = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			if (session?.user) {
				// Logged-in user: update their newsletterOptIn preference
				const response = await fetch("/api/user/newsletter-preference", {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ newsletterOptIn: optIn }),
				});

				if (!response.ok) {
					throw new Error("Failed to update preference");
				}

				toast({
					title: optIn ? "Subscribed!" : "Unsubscribed",
					description: optIn ? "You'll now receive our newsletter updates." : "You've been removed from the newsletter list.",
					status: "success",
					duration: 5000,
					isClosable: true,
				});
			} else {
				// Guest: add to Subscriber table
				const response = await fetch("/api/newsletter/subscribe", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, name }),
				});

				if (!response.ok) {
					const error = await response.json();
					throw new Error(error.error || "Failed to subscribe");
				}

				toast({
					title: "Subscribed!",
					description: "Thank you for subscribing to our newsletter!",
					status: "success",
					duration: 5000,
					isClosable: true,
				});

				setEmail("");
				setName("");
			}
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

	return (
		<Box bg="white" color="gray.800" py={8} px={6} borderRadius="xl" border="1px solid" borderColor="whiteAlpha.300" boxShadow="2xl">
			<VStack spacing={4} align="stretch" maxW="md" mx="auto">
				<Heading size="md" color="brand.700" textAlign="center">
					Stay Connected
				</Heading>
				<Text fontSize="sm" color="gray.600" textAlign="center">
					Subscribe to receive updates about workshops, classes, and special offers.
				</Text>

				{session?.user ? (
					// Logged-in user view
					<FormControl>
						<Checkbox isChecked={optIn} onChange={(e) => setOptIn(e.target.checked)} colorScheme="brand" size="lg">
							<Text fontSize="sm" color="gray.700">
								I want to receive the newsletter at {session.user.email}
							</Text>
						</Checkbox>
						<Button
							mt={4}
							colorScheme="brand"
							onClick={handleSubscribe}
							isLoading={isLoading || isPreferenceLoading}
							isDisabled={isPreferenceLoading}
							width="full">
							{optIn ? "Subscribe" : "Unsubscribe"}
						</Button>
					</FormControl>
				) : (
					// Guest view
					<form onSubmit={handleSubscribe}>
						<VStack spacing={3}>
							<FormControl isRequired>
								<FormLabel fontSize="sm" color="gray.700">
									Email
								</FormLabel>
								<Input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="your@email.com"
									size="sm"
									bg="gray.50"
									borderColor="gray.300"
									_placeholder={{ color: "gray.500" }}
								/>
							</FormControl>
							<FormControl>
								<FormLabel fontSize="sm" color="gray.700">
									Name (optional)
								</FormLabel>
								<Input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="Your name"
									size="sm"
									bg="gray.50"
									borderColor="gray.300"
									_placeholder={{ color: "gray.500" }}
								/>
							</FormControl>
							<Button type="submit" colorScheme="brand" isLoading={isLoading} width="full" size="sm">
								Subscribe
							</Button>
						</VStack>
					</form>
				)}
			</VStack>
		</Box>
	);
}

"use client";

import { useEffect, useState } from "react";
import { useToast, Box, Text, HStack, VStack, Button } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { FaHeart, FaTimes } from "react-icons/fa";

export default function WelcomeToast() {
	const toast = useToast();
	const { status } = useSession();
	const [hasShownToast, setHasShownToast] = useState(false);
	const [isBrowser, setIsBrowser] = useState(false);

	// Set isBrowser to true when component mounts in the browser
	useEffect(() => {
		setIsBrowser(true);
	}, []);

	useEffect(() => {
		if (!isBrowser) return;
		// Show toast only once per user
		const hasToastBeenShown = window.localStorage.getItem("welcomeToastShown");

		if (!hasToastBeenShown && !hasShownToast) {
			// Delay the toast slightly for better UX
			const timer = setTimeout(() => {
				const toastId = toast({
					position: "top",
					duration: 10000,
					isClosable: true,
					render: ({ onClose }) => (
						<Box color="white" p={4} bg="brand.100" borderRadius="md" boxShadow="md">
							<HStack justifyContent="space-between" alignItems="flex-start">
								<HStack spacing={3}>
									<FaHeart size="24px" />
									<VStack align="start" spacing={1}>
										<Text fontWeight="bold" fontSize="md">
											Welcome to Sarah K. Yoga!
										</Text>
										<Text fontSize="sm">
											We&apos;ve recently refreshed our member system. Even if you&apos;ve signed up before, please register again to
											enjoy all member benefits and special offers!
										</Text>
										<HStack pt={1}>
											<Button
												size="sm"
												colorScheme="white"
												variant="outline"
												onClick={() => {
													window.location.href = "/register";
													onClose();
												}}>
												Register Now
											</Button>
											<Button size="sm" colorScheme="white" variant="ghost" onClick={onClose}>
												Maybe Later
											</Button>
										</HStack>
									</VStack>
								</HStack>
								<Box onClick={onClose} cursor="pointer">
									<FaTimes />
								</Box>
							</HStack>
						</Box>
					),
				});

				// Mark as shown in current component state and localStorage
				setHasShownToast(true);
				window.localStorage.setItem("welcomeToastShown", "true");

				return () => {
					clearTimeout(timer);
					if (toastId) toast.close(toastId);
				};
			}, 1500);

			return () => clearTimeout(timer);
		}
	}, [toast, hasShownToast, status]);

	return null;
}

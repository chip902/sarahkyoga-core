// app/pages/auth/forgot-password.tsx
"use client";
import { useState } from "react";
import {
	Button,
	Container,
	FormControl,
	FormLabel,
	Input,
	Text,
	useToast,
	VStack,
	Alert,
	AlertIcon,
	AlertDescription,
} from "@chakra-ui/react";
import useForgotPassword from "../../hooks/useForgotPassword";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [validationError, setValidationError] = useState("");
	const { message, isLoading, resetPassword, handleCallback } = useForgotPassword();
	const toast = useToast();

	const onResetForm = () => {
		setEmail("");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setValidationError("");

		// Validate email format
		if (!email || !email.includes("@")) {
			const errorMsg = "Please enter a valid email address.";
			setValidationError(errorMsg);
			toast({
				title: "Validation Error",
				description: errorMsg,
				status: "error",
				duration: 5000,
				isClosable: true,
			});
			return;
		}

		await resetPassword(email);
		handleCallback(onResetForm);

		// Determine if message is an error or success
		const isError = message.toLowerCase().includes("error");

		toast({
			title: isError ? "Error" : "Email Sent",
			description: message,
			status: isError ? "error" : "success",
			duration: 7000,
			isClosable: true,
			position: "top",
		});
	};

	return (
		<Container maxW="md" py={{ base: "12", md: "24" }} mt={80} bgColor="brand.600" borderRadius={20}>
			<VStack spacing={4} align="stretch">
				<Text fontSize="xl" fontWeight="bold">
					Forgot Password
				</Text>

				<Text fontSize="sm" color="gray.600">
					Enter your email address and we'll send you a link to reset your password.
				</Text>

				{validationError && (
					<Alert status="error">
						<AlertIcon />
						<AlertDescription>{validationError}</AlertDescription>
					</Alert>
				)}

				<form onSubmit={handleSubmit}>
					<VStack spacing={4} align="stretch">
						<FormControl isRequired>
							<FormLabel htmlFor="email">Email Address</FormLabel>
							<Input
								id="email"
								type="email"
								value={email}
								onChange={(e) => {
									setEmail(e.target.value);
									setValidationError("");
								}}
								placeholder="you@example.com"
								required
							/>
						</FormControl>

						<Button
							type="submit"
							isLoading={isLoading}
							colorScheme="brand"
							width="full"
							loadingText="Sending Email...">
							Send Reset Link
						</Button>
					</VStack>
				</form>
			</VStack>
		</Container>
	);
};

export default ForgotPassword;

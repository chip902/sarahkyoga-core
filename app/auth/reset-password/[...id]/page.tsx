// app/pages/auth/reset-password.tsx
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
	Box,
	Button,
	Input,
	Text,
	FormLabel,
	useToast,
	Container,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	VStack,
} from "@chakra-ui/react";
import useResetPassword from "@/app/hooks/useResetPassword";

const ResetPassword = () => {
	const router = useRouter();
	const toast = useToast();
	const params = useParams();
	const id = params?.id;

	// Extract token from params
	let token = "";
	if (typeof id === "string") {
		token = id;
	} else if (Array.isArray(id)) {
		token = id[0] || "";
	}

	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [validationError, setValidationError] = useState("");
	// Import and use the hook
	const { resetPassword, isLoading, error } = useResetPassword(token);

	// Show toast when API error occurs
	useEffect(() => {
		if (error) {
			toast({
				title: "Error",
				description: error,
				status: "error",
				duration: 7000,
				isClosable: true,
				position: "top",
			});
		}
	}, [error, toast]);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setValidationError("");

		// Validate fields are not empty
		if (!newPassword || !confirmPassword) {
			const errorMsg = "Please fill in both password fields.";
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

		// Validate password length
		if (newPassword.length < 8) {
			const errorMsg = "Password must be at least 8 characters long.";
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

		// Validate passwords match
		if (newPassword !== confirmPassword) {
			const errorMsg = "The passwords do not match.";
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

		const resetSuccessful = await resetPassword(newPassword);
		if (resetSuccessful) {
			toast({
				title: "Success",
				description: "Password reset successfully! Please log in with your new password.",
				status: "success",
				duration: 5000,
				isClosable: true,
				position: "top",
			});
			setTimeout(() => {
				router.push("/auth/login");
			}, 1500);
		}
	};

	return (
		<Container maxW="md" py={{ base: "12", md: "24" }} mt={80} bgColor="brand.600" borderRadius={20}>
			<VStack spacing={4} align="stretch">
				<Text fontSize="xl" fontWeight="bold">
					Reset Password
				</Text>

				{!token && (
					<Alert status="error">
						<AlertIcon />
						<AlertTitle>Invalid Link</AlertTitle>
						<AlertDescription>
							This password reset link is invalid. Please request a new one.
						</AlertDescription>
					</Alert>
				)}

				{validationError && (
					<Alert status="error">
						<AlertIcon />
						<AlertDescription>{validationError}</AlertDescription>
					</Alert>
				)}

				<form onSubmit={handleSubmit}>
					<VStack spacing={4} align="stretch">
						<Box>
							<FormLabel htmlFor="newPassword">New Password:</FormLabel>
							<Input
								type="password"
								id="newPassword"
								value={newPassword}
								onChange={(e) => {
									setNewPassword(e.target.value);
									setValidationError("");
								}}
								placeholder="Minimum 8 characters"
								isDisabled={!token}
								required
							/>
						</Box>

						<Box>
							<FormLabel htmlFor="confirmPassword">Confirm Password:</FormLabel>
							<Input
								type="password"
								id="confirmPassword"
								value={confirmPassword}
								onChange={(e) => {
									setConfirmPassword(e.target.value);
									setValidationError("");
								}}
								placeholder="Re-enter your password"
								isDisabled={!token}
								required
							/>
						</Box>

						<Button
							type="submit"
							colorScheme="teal"
							width="full"
							isLoading={isLoading}
							isDisabled={!token || isLoading}
							loadingText="Resetting Password...">
							Reset Password
						</Button>
					</VStack>
				</form>
			</VStack>
		</Container>
	);
};

export default ResetPassword;

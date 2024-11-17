// app/pages/auth/forgot-password.tsx
"use client";
import { useState } from "react";
import { Button, Container, FormControl, FormLabel, Input, Text, useToast } from "@chakra-ui/react";
import useForgotPassword from "../../hooks/useForgotPassword";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const { message, isLoading, resetPassword, handleCallback } = useForgotPassword();
	const toast = useToast();
	const onResetForm = () => {
		setEmail("");
	};
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await resetPassword(email);
		handleCallback(onResetForm);

		toast({
			title: "Password Reset Email Sent",
			description: message,
			status: "info",
			duration: 5000,
			isClosable: true,
		});
	};

	return (
		<Container maxW="md" py={{ base: "12", md: "24" }} mt={80} bgColor="brand.600" borderRadius={20}>
			<Text fontSize="xl" fontWeight="bold" mb={4}>
				Forgot Password
			</Text>

			<form onSubmit={handleSubmit}>
				<FormControl>
					<FormLabel htmlFor="email">Email Address</FormLabel>
					<Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
				</FormControl>

				<Button
					mt={10}
					type="submit"
					isLoading={isLoading}
					colorScheme="brand"
					onClick={(e) => {
						handleSubmit(e);
					}}>
					{isLoading ? "Sending..." : "Send Reset Link"}
				</Button>
			</form>
		</Container>
	);
};

export default ForgotPassword;

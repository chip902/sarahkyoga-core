// app/pages/auth/forgot-password.tsx
"use client";
import { useState } from "react";
import { Button, Container, Text, Input } from "@chakra-ui/react";
import useForgotPassword from "../../hooks/useForgotPassword";
import { toaster } from "@/src/components/ui/toaster";
import { Field } from "@/src/components/ui/field";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const { message, isLoading, resetPassword, handleCallback } = useForgotPassword();
	const onResetForm = () => {
		setEmail("");
	};
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await resetPassword(email);
		handleCallback(onResetForm);

		toaster.create({
			title: "Password Reset Email Sent",
			description: message,
			type: "info",
			duration: 5000,
		});
	};

	return (
		<Container maxW="md" py={{ base: "12", md: "24" }} mt={80} bgColor="brand.600" borderRadius={20}>
			<Text fontSize="xl" fontWeight="bold" mb={4}>
				Forgot Password
			</Text>

			<form onSubmit={handleSubmit}>
				<Field>Email Address</Field>
				<Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

				<Button
					mt={10}
					type="submit"
					disabled={isLoading}
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

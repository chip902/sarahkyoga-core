// app/pages/auth/reset-password.tsx
"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Button, Input, Text, FormLabel, useToast, Container } from "@chakra-ui/react";
import useResetPassword from "@/app/hooks/useResetPassword";

const ResetPassword = () => {
	const router = useRouter();
	const toast = useToast();
	const pathname = useParams()?.token;
	let parts: string | string[] = [];

	if (typeof pathname === "string") {
		parts = pathname.split("/");
	} else if (Array.isArray(pathname)) {
		parts = pathname as Array<string>;
	}

	const token = parts[parts?.length - 1] || "";

	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	// Import and use the hook
	const { resetPassword, isLoading, error } = useResetPassword(token);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (newPassword !== confirmPassword) {
			toast({
				title: "Validation Error",
				description: "The passwords do not match.",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
			return;
		}

		const resetSuccessful = await resetPassword(newPassword);
		if (resetSuccessful) {
			alert("Password reset successfully!");
			router.push("/auth/login"); // Redirect on success
		}
	};

	return (
		<Container maxW="md" py={{ base: "12", md: "24" }} mt={80} bgColor="brand.600" borderRadius={20}>
			<Text fontSize="xl" fontWeight="bold">
				Reset Password
			</Text>
			{error && <Text color="red.500">{error}</Text>}
			<form onSubmit={handleSubmit}>
				<FormLabel htmlFor="newPassword">New Password:</FormLabel>
				<Input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
				<FormLabel htmlFor="confirmPassword" mt={4}>
					Confirm Password:
				</FormLabel>
				<Input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
				<Button type="submit" colorScheme="teal" mt={6} isLoading={isLoading}>
					Reset Password
				</Button>
			</form>
		</Container>
	);
};

export default ResetPassword;

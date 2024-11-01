// app/pages/auth/reset-password.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Input, Text, FormLabel, useToast } from "@chakra-ui/react";
import useResetPassword from "@/app/hooks/useResetPassword";

const ResetPassword = () => {
	const router = useRouter();
	const toast = useToast();
	const pathname = document.location.pathname; // Use location directly in client component

	let parts = pathname?.split("/");
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
		<Box p={8}>
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
		</Box>
	);
};

export default ResetPassword;

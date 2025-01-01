// app/pages/auth/reset-password.tsx
"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Input, Text, Container } from "@chakra-ui/react";
import useResetPassword from "@/app/hooks/useResetPassword";
import { toaster } from "@/src/components/ui/toaster";
import { Field } from "@/src/components/ui/field";

const ResetPassword = () => {
	const router = useRouter();
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
			toaster.create({
				title: "Validation Error",
				description: "The passwords do not match.",
				type: "error",
				duration: 5000,
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
				<Field>New Password:</Field>
				<Input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
				<Field mt={4}>Confirm Password:</Field>
				<Input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
				<Button type="submit" colorScheme="teal" mt={6} disabled={isLoading}>
					Reset Password
				</Button>
			</form>
		</Container>
	);
};

export default ResetPassword;

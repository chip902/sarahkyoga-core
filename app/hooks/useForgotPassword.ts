// app/hooks/useForgotPassword.ts
import { useState, useCallback } from "react";

const useForgotPassword = () => {
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [resetForm, setResetForm] = useState<(() => void) | null>(null);

	const handleCallback = useCallback((callback: () => void) => {
		setResetForm(() => callback);
	}, []);

	const resetPassword = useCallback(
		async (email: string) => {
			setIsLoading(true);
			setMessage("");

			try {
				const response = await fetch("/api/auth/resetpassword", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email: email.trim() }),
				});

				const data = await response.json();

				if (response.ok) {
					setMessage(data.message || "Password reset link sent to your email.");
					if (resetForm) {
						resetForm();
					}
				} else {
					setMessage(`Error: ${data.error || "Failed to send reset link"}`);
				}
			} catch (error) {
				console.error("Password reset error:", error);
				setMessage("An error occurred during the process. Please try again later.");
			} finally {
				setIsLoading(false);
			}
		},
		[resetForm]
	);

	return { message, isLoading, resetPassword, handleCallback };
};

export default useForgotPassword;

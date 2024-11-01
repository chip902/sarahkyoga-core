// app/hooks/useForgotPassword.ts
import { useState, useCallback } from "react";

const useForgotPassword = () => {
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const resetPassword = useCallback(async (email: string) => {
		setIsLoading(true);
		setMessage("");

		try {
			const response = await fetch("/api/auth/resetpassword", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});

			if (response.ok) {
				setMessage("Password reset link sent to your email.");
			} else {
				const errorData = await response.json();
				setMessage(`Error sending reset link: ${errorData.message}`);
			}
		} catch (error) {
			setMessage("An Error occurred during the process. Please try again later.");
		} finally {
			setIsLoading(false);
		}
	}, []);

	return { message, isLoading, resetPassword };
};

export default useForgotPassword;

// app/hooks/useResetPassword.ts

import { useState } from "react";
import axios from "axios";

const useResetPassword = (token: string) => {
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const resetPassword = async (newPassword: string) => {
		setError(null);
		setIsLoading(true);

		try {
			const response = await axios.post(`/api/auth/resetpassword/${token}`, {
				newPassword: newPassword, // Send directly as a field
			});

			if (response.status === 200) {
				// Handle success
				setError(null);
				setIsLoading(false);
				return true;
			} else {
				setError("Error resetting password. Please try again.");
				setIsLoading(false);
				return false;
			}
		} catch (error) {
			console.error("An error occurred:", error);
			setError("An error occurred during password reset.");
			setIsLoading(false);
			return false;
		}
	};

	return { resetPassword, isLoading, error };
};

export default useResetPassword;

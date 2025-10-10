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
				newPassword: newPassword,
			});

			if (response.status === 200) {
				setError(null);
				setIsLoading(false);
				return true;
			} else {
				setError(response.data?.error || "Error resetting password. Please try again.");
				setIsLoading(false);
				return false;
			}
		} catch (error: any) {
			console.error("Password reset error:", error);
			const errorMessage = error.response?.data?.error || "An error occurred during password reset.";
			setError(errorMessage);
			setIsLoading(false);
			return false;
		}
	};

	return { resetPassword, isLoading, error };
};

export default useResetPassword;

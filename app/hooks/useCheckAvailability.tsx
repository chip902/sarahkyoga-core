import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

type AvailabilityState = "Available" | "Busy" | "Failed to check availability" | null;

const useCheckAvailability = () => {
	const { data: session } = useSession();
	const [availability, setAvailability] = useState<AvailabilityState>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const checkAvailability = async (timeMin: string, timeMax: string): Promise<AvailabilityState> => {
		if (!session) {
			throw new Error("User is not authenticated");
		}

		setLoading(true);
		setError(null);

		try {
			const response = await axios.post("/api/availability", {
				accessToken: session.accessToken, // Assuming session has the accessToken
				timeMin,
				timeMax,
			});

			const availabilityState: AvailabilityState = response.data.isAvailable ? "Available" : "Busy";
			setAvailability(availabilityState);
			return availabilityState; // Return the availability result
		} catch (error) {
			console.error("Error checking availability:", error);
			setError("Failed to check availability");
			setAvailability("Failed to check availability");
			return "Failed to check availability"; // Return the error state
		} finally {
			setLoading(false);
		}
	};

	return { checkAvailability, availability, loading, error };
};

export default useCheckAvailability;

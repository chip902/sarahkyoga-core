// hooks/useAddToCart.ts
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useAddToCart = (productId: string) => {
	const [isLoading, setIsLoading] = useState(false);
	const queryClient = useQueryClient();
	const toast = useToast();
	const router = useRouter();

	const addToCart = async () => {
		setIsLoading(true);

		try {
			toast.promise(axios.post("/api/cart", { productId }), {
				loading: { title: "Adding class to cart..." },
				success: (response) => ({
					title: "Success",
					description: response.data.message || "Class added to your cart.",
					status: "success",
					duration: 3000,
					isClosable: true,
				}),
				error: (error) => ({
					title: "Error",
					description: `Failed to add class to cart. ${String(error.message)}`,
					status: "error",
					duration: 5000,
					isClosable: true,
				}),
			});

			// Invalidate or update your query cache if needed
			await queryClient.invalidateQueries({ queryKey: ["cart"] });
			router.push("/booking/checkout");
		} catch (error) {
			console.error("Failed to add class to cart:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return { addToCart, isLoading };
};

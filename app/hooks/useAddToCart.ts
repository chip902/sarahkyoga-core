// hooks/useAddToCart.ts
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // Import this for auth status

export const useAddToCart = (productId: string) => {
	const [isLoading, setIsLoading] = useState(false);
	const queryClient = useQueryClient();
	const toast = useToast();
	const router = useRouter();
	const { status } = useSession(); // Use next-auth to check login status

	const isLoggedIn = status === "authenticated";

	const addToCart = async () => {
		setIsLoading(true);

		try {
			const headers: Record<string, string> = {
				"Content-Type": "application/json",
			};

			// If not logged in, include cartId from localStorage if it exists
			if (!isLoggedIn) {
				const cartId = localStorage.getItem("cartId");
				if (cartId) {
					headers["x-cart-id"] = cartId;
				}
			}

			const response = await fetch("/api/cart", {
				method: "POST",
				headers,
				body: JSON.stringify({ productId }),
			});

			if (!response.ok) {
				throw new Error("Failed to add item to cart");
			}

			const data = await response.json();

			// If guest user, update cartId in localStorage from response header
			if (!isLoggedIn) {
				const newCartId = response.headers.get("x-cart-id");
				if (newCartId) {
					localStorage.setItem("cartId", newCartId);
				}
			}

			// Show success message
			toast({
				title: "Added to cart",
				description: "Item has been added to your cart",
				status: "success",
				duration: 3000,
				isClosable: true,
			});

			// Invalidate or update your query cache if needed
			await queryClient.invalidateQueries({ queryKey: ["cart"] });
			router.push("/booking/checkout");
		} catch (error) {
			console.error("Failed to add class to cart:", error);
			toast({
				title: "Error",
				description: "Failed to add item to cart. Please try again.",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return { addToCart, isLoading };
};

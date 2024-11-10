"use client";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useState } from "react";
import { Button, Spinner, useToast } from "@chakra-ui/react";
import { QueryClient, useQueryClient } from "@tanstack/react-query";

const addToCart = async (productId: string, toast: any) => {
	try {
		const response = await axios.post("/api/cart", {
			productId,
		});

		if (response.status === 201) {
			// Handle success
			toast({
				title: "Added to Cart",
				description: "Your class has been successfully added to the cart.",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
		}
	} catch (error: any) {
		console.error("Error adding product to cart:", error);
		// Handle failure
		toast({
			title: "Failed to Add to Cart",
			description: error.message || "An unexpected error occurred.",
			status: "error",
			duration: 3000,
			isClosable: true,
		});
	}
};

export const BookNowButton = ({ productId }: { productId: string }) => {
	const [isLoading, setIsLoading] = useState(false);
	const { data: session } = useSession();
	const queryClient = useQueryClient();
	const toast = useToast();

	const handleAddToCart = async () => {
		setIsLoading(true);
		try {
			await addToCart(productId, toast);
		} finally {
			queryClient.invalidateQueries({ queryKey: ["cart"] });
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return <Spinner />;
	}

	if (productId === "0") {
		return (
			<Button onClick={handleAddToCart} bg="brand.600" variant="cta">
				Book Now!
			</Button>
		);
	}

	if (!session) {
		return (
			<Button variant="cta" isDisabled>
				Login to book
			</Button>
		);
	}

	return (
		<Button onClick={() => addToCart(productId, toast)} bg="brand.600" variant="cta">
			Book Now
		</Button>
	);
};

// /app/booking/BookNow.tsx
"use client";
import { useSession } from "next-auth/react";
import { Button, Spinner, useToast } from "@chakra-ui/react";
import { useAddToCart } from "@/app/hooks/useAddToCart";

export const BookNowButton = ({ productId }: { productId: string }) => {
	const { data: session } = useSession();
	const toast = useToast();

	const { addToCart, isLoading } = useAddToCart(productId);

	// Handler for the add to cart action
	const handleAddToCart = async () => {
		if (!session && productId !== "1") {
			toast({
				title: "Please log in",
				description: "You need to be logged in to book a class.",
				status: "warning",
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		addToCart();
	};

	if (isLoading) {
		return <Spinner />;
	}

	if (!session && productId !== "0") {
		return (
			<Button variant="cta" isDisabled>
				Login to book
			</Button>
		);
	}

	return (
		<Button onClick={handleAddToCart} bg="brand.600" variant="cta">
			Book Now
		</Button>
	);
};

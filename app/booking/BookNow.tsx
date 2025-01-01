// /app/booking/BookNow.tsx
"use client";
import { useSession } from "next-auth/react";
import { Button, Spinner } from "@chakra-ui/react";
import { toaster } from "@/src/components/ui/toaster";
import { useAddToCart } from "@/app/hooks/useAddToCart";

export const BookNowButton = ({ productId }: { productId: string }) => {
	const { data: session } = useSession();

	const { addToCart, isLoading } = useAddToCart(productId);

	// Handler for the add to cart action
	const handleAddToCart = async () => {
		if (!session && productId !== "0") {
			toaster.create({
				title: "Please log in",
				description: "You need to be logged in to book a class.",
				type: "warning",
				duration: 3000,
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
			<Button variant="subtle" disabled>
				Login to book
			</Button>
		);
	}

	return (
		<Button onClick={handleAddToCart} bg="brand.600" variant="solid">
			Book Now
		</Button>
	);
};

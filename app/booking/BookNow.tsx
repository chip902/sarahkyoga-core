import { useSession } from "next-auth/react";
import axios from "axios";
import { Button, ButtonGroup, useToast } from "@chakra-ui/react";

const addToCart = async (productId: string, toast: any) => {
	try {
		const response = await axios.post("/api/cart", {
			productId,
		});

		if (response.status === 200) {
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
	const { data: session } = useSession();
	const toast = useToast();

	if (productId === "0") {
		return (
			<Button onClick={() => addToCart(productId, toast)} bg="brand.600" variant="cta">
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

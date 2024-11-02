import { useSession } from "next-auth/react";
import axios from "axios";
import { Button, useToast } from "@chakra-ui/react";

const addToCart = async (productId: string) => {
	const toast = useToast();

	try {
		const response = await axios.post("/api/cart", {
			productId,
		});

		if (response.status === 200) {
			// Handle success (e.g., show a success message or navigate to the cart)
			toast({
				title: "Success!",
				description: "Your class is in your cart.",
				status: "success",
				duration: 5000,
				isClosable: true,
			});
		}
	} catch (error) {
		console.error("Error adding product to cart:", error);
	}
};

export const BookNowButton = ({ productId }: { productId: string }) => {
	const { data: session } = useSession();

	if (!session) {
		return <Button isDisabled>Login to book</Button>;
	}

	return (
		<Button onClick={() => addToCart(productId)} bg="brand.600" variant="cta">
			Book Now
		</Button>
	);
};

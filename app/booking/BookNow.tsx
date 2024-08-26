import { useSession } from "next-auth/react";
import axios from "axios";
import { Button } from "@chakra-ui/react";

const addToCart = async (productId: string) => {
	try {
		const response = await axios.post("/api/cart", {
			productId,
		});

		if (response.status === 200) {
			// Handle success (e.g., show a success message or navigate to the cart)
			alert("Product added to cart!");
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
		<Button onClick={() => addToCart(productId)} colorScheme="teal">
			Book Now
		</Button>
	);
};

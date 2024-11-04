import { CartItem } from "@/types";
import { useEffect, useState } from "react";

const useCart = () => {
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [cartItemsCount, setCartItemsCount] = useState(0);

	useEffect(() => {
		const fetchCartItems = async () => {
			try {
				const response = await fetch("/api/cart"); // Your Prisma DB API route.
				if (!response.ok) throw new Error("Failed to fetch cart items.");
				const data = await response.json();
				setCartItems(data.items); // Update state with fetched data
			} catch (error) {
				console.error(error);
			}
		};

		fetchCartItems();
	}, []);

	useEffect(() => {
		// Automatically update cartItemsCount whenever cartItems change
		setCartItemsCount(cartItems.length);
	}, [cartItems]);

	return { cartItems, cartItemsCount, setCartItemsCount };
};

export default useCart;

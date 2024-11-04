"use client";
import { IconButton, Badge } from "@chakra-ui/react";
import { MdShoppingCart } from "react-icons/md";
import { useEffect, useState } from "react";
import useCart from "@/app/hooks/useCart";

const ShoppingCartIcon = () => {
	const [cartItemsCount, setCartItemsCount] = useState(0);

	useEffect(() => {
		const fetchCartItems = async () => {
			try {
				const response = await fetch("/api/cart"); // Your Prisma DB API route.
				if (!response.ok) throw new Error("Failed to fetch cart items.");
				const data = await response.json();
				setCartItemsCount(data.length);
			} catch (error) {
				console.error(error);
			}
		};

		fetchCartItems();
	}, []);

	return (
		<IconButton aria-label="Shopping cart" icon={<MdShoppingCart />}>
			{cartItemsCount > 0 && (
				<Badge colorScheme="red" position="absolute" top="-1px" right="-1px">
					{cartItemsCount}
				</Badge>
			)}
		</IconButton>
	);
};

export default ShoppingCartIcon;

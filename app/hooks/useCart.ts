// app/hooks/useCart.ts
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { CartItem } from "@/types/index";

const useCart = () => {
	const queryClient = useQueryClient();
	const [cartItemsCount, setCartItemsCount] = useState(0);

	const addToCartMutation = useMutation({
		mutationFn: (item: CartItem) => axios.post("/api/cart", item),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},
	});

	const updateCartMutation = useMutation({
		mutationFn: (item: CartItem) => axios.put(`/api/cart/${item.id}`, item),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},
	});
	const removeFromCartMutation = useMutation({
		mutationFn: (cartItemId: string) => axios.delete(`/api/cart/${cartItemId}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},
	});
	const {
		data: cartItems,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["cart"],
		queryFn: async () => {
			try {
				const response = await axios.get("/api/cart");
				if (!response.data) throw new Error("Failed to fetch cart items.");
				return response.data;
			} catch (error) {
				throw new Error(`Error: ${error}`);
			}
		},
	});

	useState(() => {
		if (Array.isArray(cartItems)) setCartItemsCount(cartItems.length);
	});

	const addItemToCart = (item: CartItem) => {
		addToCartMutation.mutate(item);
	};

	const removeItemFromCart = (item: string) => {
		removeFromCartMutation.mutate(item);
	};

	return { cartItems, cartItemsCount, isLoading, isError, addItemToCart, removeItemFromCart };
};

export default useCart;

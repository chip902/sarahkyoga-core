// app/hooks/useCart.ts
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { CartItem } from "@/types/index";

const useCart = () => {
	const queryClient = useQueryClient();
	const [cartItemsCount, setCartItemsCount] = useState(0);

	const {
		data: cartItems,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["cart"],
		retry: 3,
		queryFn: async () => {
			try {
				const response = await axios.get("/api/cart");
				console.log("useQuery /api/cart response:", response.data);
				if (!response.data) throw new Error("Failed to fetch cart items.");
				return response.data;
			} catch (error) {
				console.error("useQuery /api/cart error:", error);
				throw new Error(`Error: ${error}`);
			}
		},
	});

	const addToCartMutation = useMutation({
		mutationFn: (item: CartItem) => axios.post("/api/cart", item),
		onSuccess: (data) => {
			console.log("addToCartMutation success:", data);
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
	});

	const updateCartItemMutation = useMutation({
		mutationFn: (updatedItem: CartItem) => axios.patch(`/api/cart/${updatedItem.id}`, updatedItem),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},
	});

	const decreaseQuantity = (item: CartItem) => {
		if (item.quantity > 0) {
			const updatedItem = { ...item, quantity: item.quantity - 1 };
			updateCartItemMutation.mutate(updatedItem);
		} else {
			console.log("Cannot decrease quantity below zero.");
		}
	};

	const removeFromCartMutation = useMutation({
		mutationFn: (cartItemId: string) => axios.patch(`/api/cart/${cartItemId}`),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},
	});

	const { mutate: clearCart } = useMutation({
		mutationFn: () => axios.delete(`/api/cart/`),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
	});

	useState(() => {
		if (Array.isArray(cartItems)) setCartItemsCount(cartItems.length);
	});

	const addItemToCart = (item: CartItem) => {
		addToCartMutation.mutate(item);
		queryClient.invalidateQueries({ queryKey: ["cart"] });
	};

	const removeItemFromCart = (item: string) => {
		removeFromCartMutation.mutate(item);
	};

	return { cartItems, cartItemsCount, isLoading, isError, addItemToCart, clearCart, removeItemFromCart, decreaseQuantity };
};

export default useCart;

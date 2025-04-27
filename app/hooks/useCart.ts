// app/hooks/useCart.ts
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { CartItem } from "@/types/index";
import { useSession } from "next-auth/react"; // Import for auth status

const useCart = () => {
	const queryClient = useQueryClient();
	const [cartItemsCount, setCartItemsCount] = useState(0);
	const { status } = useSession(); // Get authentication status
	const isLoggedIn = status === "authenticated";

	// Configure axios with headers for guest users
	const getAxiosConfig = () => {
		const config: { headers?: Record<string, string> } = {};

		// Only add cart ID header for guest users
		if (!isLoggedIn) {
			const cartId = localStorage.getItem("cartId");
			if (cartId) {
				config.headers = {
					"x-cart-id": cartId,
				};
			}
		}

		return config;
	};

	// Fetch cart items
	const {
		data: cartItems,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["cart", isLoggedIn], // Add auth status to key for proper cache invalidation
		retry: 3,
		queryFn: async () => {
			try {
				const response = await axios.get("/api/cart", getAxiosConfig());
				console.log("useQuery /api/cart response:", response.data);

				// For guest users, check if we got a cart ID in headers
				if (!isLoggedIn && response.headers["x-cart-id"]) {
					localStorage.setItem("cartId", response.headers["x-cart-id"]);
				}

				if (!response.data) throw new Error("Failed to fetch cart items.");
				return response.data;
			} catch (error) {
				console.error("useQuery /api/cart error:", error);
				throw new Error(`Error: ${error}`);
			}
		},
	});

	// Add item to cart mutation
	const addToCartMutation = useMutation({
		mutationFn: (productId: string) => axios.post("/api/cart", { productId }, getAxiosConfig()),
		onSuccess: (response) => {
			console.log("addToCartMutation success:", response.data);

			// For guest users, store cart ID from response headers
			if (!isLoggedIn && response.headers["x-cart-id"]) {
				localStorage.setItem("cartId", response.headers["x-cart-id"]);
			}

			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
	});

	// Update cart item mutation
	const updateCartItemMutation = useMutation({
		mutationFn: (updatedItem: { cartItemId: string; quantity: number }) => axios.patch("/api/cart", updatedItem, getAxiosConfig()),
		onSuccess: (response) => {
			// For guest users, check if we need to update cart ID
			if (!isLoggedIn && response.headers["x-cart-id"]) {
				localStorage.setItem("cartId", response.headers["x-cart-id"]);
			}

			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},
	});

	// Decrease quantity handler
	const decreaseQuantity = (item: CartItem) => {
		if (item.quantity > 0) {
			updateCartItemMutation.mutate({
				cartItemId: item.id,
				quantity: item.quantity - 1,
			});
		} else {
			console.log("Cannot decrease quantity below zero.");
		}
	};

	// Remove from cart mutation
	const removeFromCartMutation = useMutation({
		mutationFn: (cartItemId: string) => {
			const url = `/api/cart?cartItemId=${cartItemId}`;
			return axios.delete(url, getAxiosConfig());
		},
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},
	});

	// Clear cart mutation
	const clearCartMutation = useMutation({
		mutationFn: (deleteCart: boolean = true) => {
			let url = "/api/cart";

			// Add deleteCart parameter to completely remove the cart
			if (deleteCart) {
				url += "?deleteCart=true";
			}

			// If guest user, add cartId parameter
			if (!isLoggedIn) {
				const cartId = localStorage.getItem("cartId");
				if (cartId) {
					url += `${url.includes("?") ? "&" : "?"}cartId=${cartId}`;
				}
			}

			return axios.delete(url, getAxiosConfig());
		},
		onSuccess: (response) => {
			// Check if we should clear localStorage
			if (!isLoggedIn && response.headers["x-clear-cart"] === "true") {
				localStorage.removeItem("cartId");
			}

			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},
	});

	// Update cart items count when cart changes
	useEffect(() => {
		if (Array.isArray(cartItems)) {
			setCartItemsCount(cartItems.length);
		}
	}, [cartItems]);

	// Simplified API for components
	const addItemToCart = (productId: string) => {
		addToCartMutation.mutate(productId);
	};

	const removeItemFromCart = (cartItemId: string) => {
		removeFromCartMutation.mutate(cartItemId);
	};

	const clearCart = (deleteCart: boolean = true) => {
		clearCartMutation.mutate(deleteCart);
	};

	return {
		cartItems,
		cartItemsCount,
		isLoading,
		isError,
		addItemToCart,
		clearCart,
		removeItemFromCart,
		decreaseQuantity,
	};
};

export default useCart;

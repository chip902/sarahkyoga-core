// app/hooks/useCart.ts
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { CartItem } from "@/types/index";
import { useSession } from "next-auth/react";

// Create a function to check and clear cart ID based on response headers
const handleCartClearResponse = (response: any) => {
	if (response?.headers?.["x-clear-cart"] === "true" || response?.data?.shouldClearLocalStorage === true) {
		window.localStorage.removeItem("cartId");
		return true;
	}
	return false;
};

const useCart = () => {
	const queryClient = useQueryClient();
	const [cartItemsCount, setCartItemsCount] = useState(0);
	const { status } = useSession();
	const isLoggedIn = status === "authenticated";
	const [isClient, setIsClient] = useState(false);

	// Add a ref to track if we've just cleared the cart
	const [cartCleared, setCartCleared] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	// Configure axios with headers for guest users
	const getAxiosConfig = () => {
		const config: { headers?: Record<string, string> } = {};

		// Only add cart ID header for guest users
		if (!isLoggedIn) {
			const cartId = window.localStorage.getItem("cartId");
			if (cartId) {
				config.headers = {
					"x-cart-id": cartId,
				};
			}
		}

		return config;
	};

	const getCartId = () => {
		if (!isClient) return null;
		return window.localStorage.getItem("cartId");
	};

	// Fetch cart items
	const {
		data: cartItems,
		isLoading,
		isError,
		refetch,
	} = useQuery({
		queryKey: ["cart", isLoggedIn],
		retry: 3,
		queryFn: async () => {
			try {
				// If cart was just cleared, return empty array immediately
				if (cartCleared) {
					setCartCleared(false);
					return [];
				}

				// Otherwise, fetch from API
				const response = await axios.get("/api/cart", getAxiosConfig());

				// For guest users, check if we got a cart ID in headers
				if (!isLoggedIn && response.headers["x-cart-id"]) {
					window.localStorage.setItem("cartId", response.headers["x-cart-id"]);
				}

				// If we get a clear cart header, handle it
				if (handleCartClearResponse(response)) {
					setCartCleared(true);
					return [];
				}

				if (!response.data) throw new Error("Failed to fetch cart items.");
				return response.data;
			} catch (error) {
				console.error("useQuery /api/cart error:", error);

				// If cart ID is invalid or deleted, return empty array
				if (axios.isAxiosError(error) && error.response?.status === 404) {
					return [];
				}

				throw new Error(`Error: ${error}`);
			}
		},
		// Disable the query when there's no cart ID for guest users
		enabled: isLoggedIn || !!getCartId(),
	});

	// Add item to cart mutation
	const addToCartMutation = useMutation({
		mutationFn: (productId: string) => axios.post("/api/cart", { productId }, getAxiosConfig()),
		onSuccess: (response) => {
			// For guest users, store cart ID from response headers
			if (!isLoggedIn && response.headers["x-cart-id"]) {
				window.localStorage.setItem("cartId", response.headers["x-cart-id"]);
			}

			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},
	});

	// Update cart item mutation
	const updateCartItemMutation = useMutation({
		mutationFn: (updatedItem: { cartItemId: string; quantity: number }) => axios.patch("/api/cart", updatedItem, getAxiosConfig()),
		onSuccess: (response) => {
			// For guest users, check if we need to update cart ID
			if (!isLoggedIn && response.headers["x-cart-id"]) {
				window.localStorage.setItem("cartId", response.headers["x-cart-id"]);
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
				const cartId = window.localStorage.getItem("cartId");
				if (cartId) {
					url += `${url.includes("?") ? "&" : "?"}cartId=${cartId}`;
				}
			}

			return axios.delete(url, getAxiosConfig());
		},
		onSuccess: (response) => {
			// Handle cart clearing
			if (handleCartClearResponse(response)) {
				setCartCleared(true);
				setCartItemsCount(0); // Immediately update count
			}

			queryClient.invalidateQueries({ queryKey: ["cart"] });
			refetch(); // Force refetch after clearing
		},
	});

	// Update cart items count when cart changes
	useEffect(() => {
		if (Array.isArray(cartItems)) {
			setCartItemsCount(cartItems.length);
		} else {
			setCartItemsCount(0);
		}
	}, [cartItems]);

	// Check for localStorage changes (for cross-tab coordination)
	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === "cartId" && e.newValue === null) {
				// If cartId was removed in another tab/component
				setCartItemsCount(0);
				queryClient.invalidateQueries({ queryKey: ["cart"] });
				refetch();
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, [queryClient, refetch]);

	// Check if we need to update on mount (in case another component cleared the cart)
	useEffect(() => {
		if (!isLoggedIn && !window.localStorage.getItem("cartId") && cartItemsCount > 0) {
			setCartItemsCount(0);
		}
	}, [isLoggedIn, cartItemsCount]);

	// Method to manually clear cart from localStorage (for use in checkout components)
	const clearCartStorage = () => {
		window.localStorage.removeItem("cartId");
		setCartItemsCount(0);
		setCartCleared(true);
		queryClient.invalidateQueries({ queryKey: ["cart"] });
		refetch();
	};

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
		clearCartStorage,
	};
};

export default useCart;

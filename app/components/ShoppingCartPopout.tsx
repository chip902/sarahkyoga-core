"use client";
import { Popover, PopoverTrigger, PopoverContent, Stack, Box, Text, Button, Badge, IconButton, Spinner } from "@chakra-ui/react";
import useCart from "../hooks/useCart";
import { MdShoppingCart } from "react-icons/md";
import { useEffect, useState } from "react";
import { CartItem } from "@/types";

type LoadingState = {
	[key: string]: boolean;
};

const ShoppingCartPopout = () => {
	const { cartItems, addItemToCart, removeItemFromCart } = useCart();

	const [cartItemsCount, setCartItemsCount] = useState(0);

	const [loadingStates, setLoadingStates] = useState<LoadingState>({});
	useEffect(() => {
		if (cartItems) {
			const initialState = cartItems.reduce((acc: any, item: { id: any }) => ({ ...acc, [item.id]: false }), {});
			setLoadingStates(initialState);
		}
	}, [cartItems]);

	useEffect(() => {
		if (cartItems) {
			console.log("Updating cartItemsCount:", cartItems.length);
			setCartItemsCount(cartItems.length);
		}
	}, [cartItems]);

	return (
		<Popover placement="bottom-end">
			<PopoverTrigger>
				<IconButton aria-label="Shopping cart" icon={<MdShoppingCart />}>
					{cartItemsCount > 0 && (
						<Badge colorScheme="red" position="absolute" zIndex={10} top="-1px" right="-1px">
							{cartItemsCount}
						</Badge>
					)}
				</IconButton>
			</PopoverTrigger>
			<PopoverContent>
				<Stack spacing={4}>
					{cartItems && cartItemsCount > 0 ? (
						cartItems.map((item: CartItem) => (
							<Box key={item.id} display="flex" alignItems="center">
								<Stack spacing={1}>
									<Text fontWeight="bold">{item.product.name}</Text>
									<Text>{`$${item.product.price} x ${item.quantity}`}</Text>
									<Box display="flex" alignItems="center">
										{loadingStates[item.id] ? (
											<Spinner />
										) : (
											<>
												<Button size="sm" onClick={() => removeItemFromCart(item.id)} mr={2}>
													-
												</Button>
												<Text>{`Quantity: ${item.quantity}`}</Text>
											</>
										)}
										<Button size="sm" onClick={() => addItemToCart(item)} ml={2}>
											+
										</Button>
									</Box>
									;
								</Stack>
							</Box>
						))
					) : (
						<></>
					)}
				</Stack>
			</PopoverContent>
		</Popover>
	);
};

export default ShoppingCartPopout;

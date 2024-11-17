import { Order } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchOrders = async (): Promise<Order[]> => {
	const response = await axios.get("/api/orders");
	if (response) {
		return response.data;
	} else {
		return [];
	}
};

export const useOrders = () =>
	useQuery<Order[]>({
		queryKey: ["orders"],
		queryFn: fetchOrders,
		staleTime: 60 * 1000,
		retry: 3,
	});

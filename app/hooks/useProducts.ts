import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Product } from "../generated/prisma/client";

const fetchProducts = async (): Promise<Product[]> => {
	const response = await axios.get("/api/products");
	if (response) {
		return response.data;
	} else {
		return [];
	}
};

export const useProducts = () =>
	useQuery<Product[]>({
		queryKey: ["products"],
		queryFn: fetchProducts,
		staleTime: 60 * 1000,
		retry: 3,
	});

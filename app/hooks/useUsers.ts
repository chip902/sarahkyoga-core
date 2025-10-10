// app/hooks/useUsers.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface User {
	id: string;
	email: string;
	firstName: string | null;
	lastName: string | null;
	role: string | null;
	type: string | null;
	image: string | null;
	emailVerified: Date | null;
	_count: {
		orders: number;
		carts: number;
	};
}

export const useUsers = () => {
	return useQuery<User[]>({
		queryKey: ["users"],
		queryFn: async () => {
			const { data } = await axios.get("/api/admin/users");
			return data;
		},
	});
};

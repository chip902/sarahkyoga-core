"use client";

import {
	Box,
	Flex,
	Heading,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	Container,
	Skeleton,
} from "@chakra-ui/react";
import { useOrders } from "@/app/hooks/useOrders";
import { Order } from "@/types";
import AdminTable, { AdminColumn } from "@/app/components/admin/AdminTable";

const columns: AdminColumn<Order>[] = [
	{ key: "orderNumber", label: "Order ID", sortable: true, filterable: true },
	{
		key: "user.firstName",
		label: "Name",
		sortable: true,
		filterable: true,
		render: (_, row) => {
			const user = row.user as { firstName?: string; lastName?: string } | undefined;
			return `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "—";
		},
	},
	{ key: "user.email", label: "Email", sortable: true, filterable: true, render: (val) => (val as string) || "—" },
	{ key: "total", label: "Amount ($)", sortable: true, sortType: "number", render: (val) => Number(val).toFixed(2) },
	{ key: "status", label: "Status", sortable: true, filterable: true },
	{ key: "createdAt", label: "Date Created", sortable: true, sortType: "date", render: (val) => new Date(val as string).toLocaleDateString() },
];

const AdminDashboard = () => {
	const { data: orders, isLoading, error } = useOrders();

	if (isLoading) {
		return (
			<Container my={{ sm: "300px" }} px={4}>
				<Skeleton w="1200px" h="500px" />
			</Container>
		);
	}

	return (
		<Container maxW="container.xl" my="300px">
			<Box bg="white" p={6} borderRadius="lg" shadow="sm">
				<Flex alignItems="center" justifyContent="space-between" mb={6}>
					<Heading fontFamily="inherit" as="h2">
						Welcome, Sarah
					</Heading>
				</Flex>

				{error && (
					<Alert status="error" my={4}>
						<AlertIcon />
						<AlertTitle>Error:</AlertTitle>
						<AlertDescription>{error.message}</AlertDescription>
					</Alert>
				)}

				{!error && (
					<AdminTable
						columns={columns}
						data={orders || []}
						pageSize={15}
						searchPlaceholder="Search orders..."
						emptyMessage="No open orders found."
					/>
				)}
			</Box>
		</Container>
	);
};

export default AdminDashboard;

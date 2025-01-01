"use client";

import { useMemo, useState } from "react";
import { Box, Flex, Heading, Table, Container, Skeleton, AlertTitle } from "@chakra-ui/react";
import { useOrders } from "@/app/hooks/useOrders";
import { SortConfig, Order } from "@/types";
import { Alert } from "@/src/components/ui/alert";

const AdminDashboard = () => {
	const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "", direction: "ascending" });
	const { data: orders, isLoading, error } = useOrders();

	const sortedOrders = useMemo(() => {
		let sortableOrders = [...(orders || [])];
		if (sortConfig.key !== null) {
			sortableOrders.sort((a, b) => {
				const aValue = Array.isArray(sortConfig.key) ? sortConfig.key.reduce((obj: any, key) => obj?.[key], a) : a[sortConfig.key as keyof Order];
				const bValue = Array.isArray(sortConfig.key) ? sortConfig.key.reduce((obj: any, key) => obj?.[key], b) : b[sortConfig.key as keyof Order];

				if (aValue < bValue) {
					return sortConfig.direction === "ascending" ? -1 : 1;
				}
				if (aValue > bValue) {
					return sortConfig.direction === "ascending" ? 1 : -1;
				}
				return 0;
			});
		}
		return sortableOrders;
	}, [orders, sortConfig]);

	const requestSort = <T extends string>(key: T) => {
		let direction: "ascending" | "descending" = "ascending";
		if (sortConfig.key !== null && JSON.stringify(sortConfig.key) === JSON.stringify(key) && sortConfig.direction === "ascending") {
			direction = "descending";
		}
		setSortConfig({ key, direction });
	};

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
				<Flex alignItems="center" justifyContent="space-between">
					<Heading fontFamily="inherit" as="h2">
						Welcome, Sarah
					</Heading>
				</Flex>

				{isLoading && (
					<Flex mt={4} justifyContent="center">
						<Skeleton boxSize="50px" color="brand.500" />
					</Flex>
				)}

				{error && (
					<Alert>
						<AlertTitle>{`Error: ${error.message}`}</AlertTitle>
					</Alert>
				)}

				{!isLoading && !error && orders?.length === 0 && (
					<Alert status="info" my={4}>
						No open orders found.
					</Alert>
				)}

				{!isLoading && !error && orders && orders?.length > 0 && (
					<Table.Root mt={4} colorScheme="gray">
						<Table.Header>
							<Table.Row>
								<Table.ColumnHeader onClick={() => requestSort("orderNumber")}>
									<Box _hover={{ cursor: "pointer" }}>Order ID</Box>
								</Table.ColumnHeader>
								<Table.ColumnHeader onClick={() => requestSort("firstName")}>
									<Box _hover={{ cursor: "pointer" }}>Name</Box>
								</Table.ColumnHeader>
								<Table.ColumnHeader onClick={() => requestSort("user.email")}>
									<Box _hover={{ cursor: "pointer" }}>Email</Box>
								</Table.ColumnHeader>
								<Table.ColumnHeader onClick={() => requestSort("item.id")}>
									<Box _hover={{ cursor: "pointer" }}>Product ID</Box>
								</Table.ColumnHeader>
								<Table.ColumnHeader onClick={() => requestSort("total")}>
									<Box _hover={{ cursor: "pointer" }}>Amount ($)</Box>
								</Table.ColumnHeader>
								<Table.ColumnHeader onClick={() => requestSort("status")}>
									<Box _hover={{ cursor: "pointer" }}>Status</Box>
								</Table.ColumnHeader>
								<Table.ColumnHeader onClick={() => requestSort("createdAt")}>
									<Box _hover={{ cursor: "pointer" }}>Date Created</Box>
								</Table.ColumnHeader>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{sortedOrders?.map((order: Order) => (
								<Table.Row key={order.id}>
									<Table.Cell>{order.orderNumber}</Table.Cell>
									<Table.Cell>{`${order.user?.firstName} ${order.user?.lastName}`}</Table.Cell>
									<Table.Cell>{order.user?.email}</Table.Cell>
									<Table.Cell>{order.item?.id}</Table.Cell>
									<Table.Cell>{order.total.toFixed(2)}</Table.Cell>
									<Table.Cell>{order.status}</Table.Cell>
									<Table.Cell>{new Date(order.createdAt).toLocaleDateString()}</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table.Root>
				)}
			</Box>
		</Container>
	);
};

export default AdminDashboard;

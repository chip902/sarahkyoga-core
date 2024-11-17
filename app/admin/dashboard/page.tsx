"use client";

import { useMemo, useState } from "react";
import {
	Box,
	Flex,
	Heading,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Spinner,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	Container,
	Skeleton,
} from "@chakra-ui/react";
import { useOrders } from "@/app/hooks/useOrders";
import { SortConfig, Order } from "@/types";

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
						<Spinner size="xl" color="blue.500" />
					</Flex>
				)}

				{error && (
					<Alert status="error" my={4}>
						<AlertIcon />
						<AlertTitle>Error:</AlertTitle>
						<AlertDescription>{error.message}</AlertDescription>
					</Alert>
				)}

				{!isLoading && !error && orders?.length === 0 && (
					<Alert status="info" my={4}>
						<AlertIcon />
						No open orders found.
					</Alert>
				)}

				{!isLoading && !error && orders && orders?.length > 0 && (
					<Table mt={4} variant="striped" colorScheme="gray">
						<Thead>
							<Tr>
								<Th onClick={() => requestSort("orderNumber")}>
									<Box _hover={{ cursor: "pointer" }}>Order ID</Box>
								</Th>
								<Th onClick={() => requestSort("firstName")}>
									<Box _hover={{ cursor: "pointer" }}>Name</Box>
								</Th>
								<Th onClick={() => requestSort("user.email")}>
									<Box _hover={{ cursor: "pointer" }}>Email</Box>
								</Th>
								<Th onClick={() => requestSort("item.id")}>
									<Box _hover={{ cursor: "pointer" }}>Product ID</Box>
								</Th>
								<Th onClick={() => requestSort("total")}>
									<Box _hover={{ cursor: "pointer" }}>Amount ($)</Box>
								</Th>
								<Th onClick={() => requestSort("status")}>
									<Box _hover={{ cursor: "pointer" }}>Status</Box>
								</Th>
								<Th onClick={() => requestSort("createdAt")}>
									<Box _hover={{ cursor: "pointer" }}>Date Created</Box>
								</Th>
							</Tr>
						</Thead>
						<Tbody>
							{sortedOrders?.map((order: Order) => (
								<Tr key={order.id}>
									<Td>{order.orderNumber}</Td>
									<Td>{`${order.user?.firstName} ${order.user?.lastName}`}</Td>
									<Td>{order.user?.email}</Td>
									<Td>{order.item?.id}</Td>
									<Td>{order.total.toFixed(2)}</Td>
									<Td>{order.status}</Td>
									<Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				)}
			</Box>
		</Container>
	);
};

export default AdminDashboard;

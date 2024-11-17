"use client";

import { useState } from "react";
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

type Order = {
	id: string;
	userId: string;
	total: number;
	status: string;
	orderNumber: string;
	createdAt: Date;
	updatedAt: Date;
	user?: {
		firstName: string;
		lastName: string;
		email: string;
	};
	item?: {
		// similarly, if 'item' object is required for order operation
		id: string;
		name: string;
	};
};

const AdminDashboard = () => {
	const [loading, setLoading] = useState();
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
				<Flex alignItems="center" justifyContent="space-between">
					<Heading fontFamily="inherit" as="h2">
						Welcome, Sarah
					</Heading>
				</Flex>

				{loading && (
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

				{!loading && !error && orders?.length === 0 && (
					<Alert status="info" my={4}>
						<AlertIcon />
						No open orders found.
					</Alert>
				)}

				{!loading && !error && orders && orders?.length > 0 && (
					<Table mt={4} variant="striped" colorScheme="gray">
						<Thead>
							<Tr>
								<Th>Order ID</Th>
								<Th>Name</Th>
								<Th>Email</Th>
								<Th>Product ID</Th>
								<Th>Amount ($)</Th>
								<Th>Status</Th>
								<Th>Date Created</Th>
							</Tr>
						</Thead>
						<Tbody>
							{orders?.map((order: Order) => (
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

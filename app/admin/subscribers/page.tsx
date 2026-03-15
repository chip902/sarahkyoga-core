"use client";

import { useState, useEffect, useMemo } from "react";
import {
	Box,
	Container,
	Heading,
	Button,
	Badge,
	useDisclosure,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	ModalFooter,
	FormControl,
	FormLabel,
	Input,
	VStack,
	HStack,
	useToast,
	IconButton,
	Spinner,
	Alert,
	AlertIcon,
	AlertDescription,
	Flex,
	Text,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import axios from "axios";
import AdminTable, { AdminColumn } from "@/app/components/admin/AdminTable";

interface Subscriber {
	id: string;
	email: string;
	name: string | null;
	active: boolean;
	createdAt: string;
	unsubscribeToken: string | null;
}

const SubscribersPage = () => {
	const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	const [formData, setFormData] = useState({
		email: "",
		name: "",
	});

	const fetchSubscribers = async () => {
		try {
			setIsLoading(true);
			const response = await axios.get("/api/admin/subscribers");
			setSubscribers(response.data);
			setError(null);
		} catch (err: unknown) {
			setError((axios.isAxiosError(err) && err.response?.data?.error) as string | undefined || "Failed to fetch subscribers");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchSubscribers();
	}, []);

	const activeCount = useMemo(() => subscribers.filter((s) => s.active).length, [subscribers]);

	const handleOpenModal = () => {
		setFormData({ email: "", name: "" });
		onOpen();
	};

	const handleSubmit = async () => {
		try {
			await axios.post("/api/admin/subscribers", formData);
			toast({ title: "Subscriber added", status: "success", duration: 3000, isClosable: true });
			onClose();
			fetchSubscribers();
		} catch (err: unknown) {
			toast({ title: "Error", description: (axios.isAxiosError(err) && err.response?.data?.error) as string | undefined || "Failed to add subscriber", status: "error", duration: 5000, isClosable: true });
		}
	};

	const handleToggleActive = async (subscriber: Subscriber) => {
		try {
			await axios.patch(`/api/admin/subscribers/${subscriber.id}`, { active: !subscriber.active });
			toast({
				title: subscriber.active ? "Unsubscribed" : "Resubscribed",
				description: subscriber.active ? `${subscriber.email} has been unsubscribed.` : `${subscriber.email} has been resubscribed.`,
				status: "success",
				duration: 3000,
				isClosable: true,
			});
			fetchSubscribers();
		} catch (err: unknown) {
			toast({ title: "Error", description: (axios.isAxiosError(err) && err.response?.data?.error) as string | undefined || "Failed to update subscriber", status: "error", duration: 5000, isClosable: true });
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to permanently delete this subscriber? This cannot be undone.")) return;
		try {
			await axios.delete(`/api/admin/subscribers/${id}`);
			toast({ title: "Subscriber deleted", status: "success", duration: 3000, isClosable: true });
			fetchSubscribers();
		} catch (err: unknown) {
			toast({ title: "Error", description: (axios.isAxiosError(err) && err.response?.data?.error) as string | undefined || "Failed to delete subscriber", status: "error", duration: 5000, isClosable: true });
		}
	};

	const columns: AdminColumn<Subscriber>[] = [
		{ key: "email", label: "Email", sortable: true, filterable: true },
		{ key: "name", label: "Name", sortable: true, filterable: true, render: (val) => (val as string) || "—" },
		{
			key: "active",
			label: "Status",
			sortable: true,
			sortType: "boolean",
			render: (val) => <Badge colorScheme={val ? "green" : "red"}>{val ? "Active" : "Inactive"}</Badge>,
		},
		{ key: "createdAt", label: "Subscribed", sortable: true, sortType: "date", render: (val) => new Date(val as string).toLocaleDateString() },
		{
			key: "actions",
			label: "Actions",
			render: (_, row) => (
				<HStack spacing={2}>
					<Button size="sm" colorScheme={row.active ? "orange" : "green"} onClick={() => handleToggleActive(row)}>
						{row.active ? "Unsubscribe" : "Resubscribe"}
					</Button>
					<IconButton aria-label="Delete" icon={<DeleteIcon />} size="sm" colorScheme="red" onClick={() => handleDelete(row.id)} />
				</HStack>
			),
		},
	];

	if (isLoading) {
		return (
			<Container maxW="container.xl" my="300px" centerContent>
				<Spinner size="xl" />
			</Container>
		);
	}

	return (
		<Container maxW="container.xl" my="300px">
			<Box bg="white" p={6} borderRadius="lg" shadow="sm">
				<Flex justifyContent="space-between" alignItems="center" mb={6}>
					<VStack align="start" spacing={1}>
						<Heading fontFamily="inherit" as="h2">
							Subscribers
						</Heading>
						<Text fontSize="sm" color="gray.500">
							{activeCount} active / {subscribers.length} total
						</Text>
					</VStack>
					<Button colorScheme="blue" onClick={handleOpenModal}>
						Add Subscriber
					</Button>
				</Flex>

				{error && (
					<Alert status="error" mb={4}>
						<AlertIcon />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<AdminTable
					columns={columns}
					data={subscribers}
					pageSize={15}
					searchPlaceholder="Search by email or name..."
					emptyMessage="No subscribers found. Add one to get started!"
				/>
			</Box>

			<Modal isOpen={isOpen} onClose={onClose} size="md">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Add Subscriber</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<VStack spacing={4}>
							<FormControl isRequired>
								<FormLabel>Email</FormLabel>
								<Input type="email" placeholder="subscriber@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
							</FormControl>
							<FormControl>
								<FormLabel>Name (optional)</FormLabel>
								<Input placeholder="Subscriber name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
							</FormControl>
						</VStack>
					</ModalBody>
					<ModalFooter>
						<Button variant="ghost" mr={3} onClick={onClose}>
							Cancel
						</Button>
						<Button colorScheme="blue" onClick={handleSubmit} isDisabled={!formData.email}>
							Add
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Container>
	);
};

export default SubscribersPage;

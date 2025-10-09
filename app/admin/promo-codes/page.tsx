"use client";

import { useState, useEffect } from "react";
import {
	Box,
	Container,
	Heading,
	Button,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
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
	Select,
	Checkbox,
	VStack,
	HStack,
	useToast,
	Spinner,
	Alert,
	AlertIcon,
	AlertDescription,
	IconButton,
	Flex,
	Text,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import axios from "axios";

interface PromoCode {
	id: string;
	code: string;
	type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_CLASS";
	value: number;
	maxUses: number | null;
	usedCount: number;
	expiresAt: string | null;
	isActive: boolean;
	description: string | null;
	createdAt: string;
	orders: any[];
}

const PromoCodesPage = () => {
	const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [editingPromoCode, setEditingPromoCode] = useState<PromoCode | null>(null);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	// Form state
	const [formData, setFormData] = useState({
		code: "",
		type: "PERCENTAGE" as "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_CLASS",
		value: 0,
		maxUses: "",
		expiresAt: "",
		description: "",
		isActive: true,
		autoGenerate: false,
	});

	// Fetch promo codes
	const fetchPromoCodes = async () => {
		try {
			setIsLoading(true);
			const response = await axios.get("/api/admin/promo-codes");
			setPromoCodes(response.data);
			setError(null);
		} catch (err: any) {
			setError(err.response?.data?.error || "Failed to fetch promo codes");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchPromoCodes();
	}, []);

	// Handle create/edit modal open
	const handleOpenModal = (promoCode?: PromoCode) => {
		if (promoCode) {
			setEditingPromoCode(promoCode);
			setFormData({
				code: promoCode.code,
				type: promoCode.type,
				value: promoCode.value,
				maxUses: promoCode.maxUses?.toString() || "",
				expiresAt: promoCode.expiresAt ? new Date(promoCode.expiresAt).toISOString().slice(0, 16) : "",
				description: promoCode.description || "",
				isActive: promoCode.isActive,
				autoGenerate: false,
			});
		} else {
			setEditingPromoCode(null);
			setFormData({
				code: "",
				type: "PERCENTAGE",
				value: 0,
				maxUses: "",
				expiresAt: "",
				description: "",
				isActive: true,
				autoGenerate: false,
			});
		}
		onOpen();
	};

	// Handle form submission
	const handleSubmit = async () => {
		try {
			const payload = {
				...formData,
				maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
				expiresAt: formData.expiresAt || null,
			};

			if (editingPromoCode) {
				// Update existing promo code
				await axios.patch(`/api/admin/promo-codes/${editingPromoCode.id}`, payload);
				toast({
					title: "Promo code updated",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
			} else {
				// Create new promo code
				await axios.post("/api/admin/promo-codes", payload);
				toast({
					title: "Promo code created",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
			}

			onClose();
			fetchPromoCodes();
		} catch (err: any) {
			toast({
				title: "Error",
				description: err.response?.data?.error || "Failed to save promo code",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
	};

	// Handle delete
	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this promo code?")) {
			return;
		}

		try {
			await axios.delete(`/api/admin/promo-codes/${id}`);
			toast({
				title: "Promo code deleted",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
			fetchPromoCodes();
		} catch (err: any) {
			toast({
				title: "Error",
				description: err.response?.data?.error || "Failed to delete promo code",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
	};

	// Toggle active status
	const handleToggleActive = async (promoCode: PromoCode) => {
		try {
			await axios.patch(`/api/admin/promo-codes/${promoCode.id}`, {
				isActive: !promoCode.isActive,
			});
			toast({
				title: promoCode.isActive ? "Promo code deactivated" : "Promo code activated",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
			fetchPromoCodes();
		} catch (err: any) {
			toast({
				title: "Error",
				description: err.response?.data?.error || "Failed to update promo code",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
	};

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
					<Heading fontFamily="inherit" as="h2">
						Promo Codes
					</Heading>
					<Button colorScheme="blue" onClick={() => handleOpenModal()}>
						Create Promo Code
					</Button>
				</Flex>

				{error && (
					<Alert status="error" mb={4}>
						<AlertIcon />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				{promoCodes.length === 0 ? (
					<Text>No promo codes found. Create one to get started!</Text>
				) : (
					<Table variant="striped" colorScheme="gray">
						<Thead>
							<Tr>
								<Th>Code</Th>
								<Th>Type</Th>
								<Th>Value</Th>
								<Th>Usage</Th>
								<Th>Status</Th>
								<Th>Expires</Th>
								<Th>Actions</Th>
							</Tr>
						</Thead>
						<Tbody>
							{promoCodes.map((promoCode) => (
								<Tr key={promoCode.id}>
									<Td fontWeight="bold">{promoCode.code}</Td>
									<Td>
										<Badge colorScheme={promoCode.type === "FREE_CLASS" ? "green" : "blue"}>
											{promoCode.type}
										</Badge>
									</Td>
									<Td>
										{promoCode.type === "PERCENTAGE"
											? `${promoCode.value}%`
											: promoCode.type === "FIXED_AMOUNT"
											? `$${promoCode.value}`
											: "Free"}
									</Td>
									<Td>
										{promoCode.usedCount}
										{promoCode.maxUses && ` / ${promoCode.maxUses}`}
									</Td>
									<Td>
										<Badge colorScheme={promoCode.isActive ? "green" : "red"}>
											{promoCode.isActive ? "Active" : "Inactive"}
										</Badge>
									</Td>
									<Td>
										{promoCode.expiresAt
											? new Date(promoCode.expiresAt).toLocaleDateString()
											: "Never"}
									</Td>
									<Td>
										<HStack spacing={2}>
											<IconButton
												aria-label="Edit"
												icon={<EditIcon />}
												size="sm"
												onClick={() => handleOpenModal(promoCode)}
											/>
											<Button
												size="sm"
												colorScheme={promoCode.isActive ? "orange" : "green"}
												onClick={() => handleToggleActive(promoCode)}>
												{promoCode.isActive ? "Deactivate" : "Activate"}
											</Button>
											{promoCode.orders.length === 0 && (
												<IconButton
													aria-label="Delete"
													icon={<DeleteIcon />}
													size="sm"
													colorScheme="red"
													onClick={() => handleDelete(promoCode.id)}
												/>
											)}
										</HStack>
									</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				)}
			</Box>

			{/* Create/Edit Modal */}
			<Modal isOpen={isOpen} onClose={onClose} size="lg">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>{editingPromoCode ? "Edit Promo Code" : "Create Promo Code"}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<VStack spacing={4}>
							{!editingPromoCode && (
								<FormControl>
									<Checkbox
										isChecked={formData.autoGenerate}
										onChange={(e) =>
											setFormData({ ...formData, autoGenerate: e.target.checked })
										}>
										Auto-generate code
									</Checkbox>
								</FormControl>
							)}

							{!formData.autoGenerate && (
								<FormControl isRequired>
									<FormLabel>Code</FormLabel>
									<Input
										placeholder="SUMMER2024"
										value={formData.code}
										onChange={(e) =>
											setFormData({ ...formData, code: e.target.value.toUpperCase() })
										}
										isDisabled={!!editingPromoCode}
									/>
								</FormControl>
							)}

							<FormControl isRequired>
								<FormLabel>Type</FormLabel>
								<Select
									value={formData.type}
									onChange={(e) =>
										setFormData({
											...formData,
											type: e.target.value as "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_CLASS",
										})
									}>
									<option value="PERCENTAGE">Percentage</option>
									<option value="FIXED_AMOUNT">Fixed Amount</option>
									<option value="FREE_CLASS">Free Class</option>
								</Select>
							</FormControl>

							{formData.type !== "FREE_CLASS" && (
								<FormControl isRequired>
									<FormLabel>
										Value {formData.type === "PERCENTAGE" ? "(%)" : "($)"}
									</FormLabel>
									<Input
										type="number"
										value={formData.value}
										onChange={(e) =>
											setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })
										}
										min={0}
										max={formData.type === "PERCENTAGE" ? 100 : undefined}
									/>
								</FormControl>
							)}

							<FormControl>
								<FormLabel>Description</FormLabel>
								<Input
									placeholder="Optional description"
									value={formData.description}
									onChange={(e) => setFormData({ ...formData, description: e.target.value })}
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Max Uses (optional)</FormLabel>
								<Input
									type="number"
									placeholder="Unlimited"
									value={formData.maxUses}
									onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
									min={0}
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Expires At (optional)</FormLabel>
								<Input
									type="datetime-local"
									value={formData.expiresAt}
									onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
								/>
							</FormControl>

							<FormControl>
								<Checkbox
									isChecked={formData.isActive}
									onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}>
									Active
								</Checkbox>
							</FormControl>
						</VStack>
					</ModalBody>

					<ModalFooter>
						<Button variant="ghost" mr={3} onClick={onClose}>
							Cancel
						</Button>
						<Button colorScheme="blue" onClick={handleSubmit}>
							{editingPromoCode ? "Update" : "Create"}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Container>
	);
};

export default PromoCodesPage;

"use client";

import { useState } from "react";
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
import { useUsers, User } from "@/app/hooks/useUsers";
import { useQueryClient } from "@tanstack/react-query";

const UsersPage = () => {
	const { data: users, isLoading, error } = useUsers();
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();
	const queryClient = useQueryClient();

	// Form state
	const [formData, setFormData] = useState({
		email: "",
		firstName: "",
		lastName: "",
		password: "",
		role: "user" as "user" | "admin",
	});

	// Handle create/edit modal open
	const handleOpenModal = (user?: User) => {
		if (user) {
			setEditingUser(user);
			setFormData({
				email: user.email,
				firstName: user.firstName || "",
				lastName: user.lastName || "",
				password: "",
				role: (user.role || "user") as "user" | "admin",
			});
		} else {
			setEditingUser(null);
			setFormData({
				email: "",
				firstName: "",
				lastName: "",
				password: "",
				role: "user",
			});
		}
		onOpen();
	};

	// Handle form submission
	const handleSubmit = async () => {
		try {
			if (editingUser) {
				// Update existing user (don't send password for updates)
				const { password, ...updateData } = formData;
				await axios.patch(`/api/admin/users/${editingUser.id}`, updateData);
				toast({
					title: "User updated",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
			} else {
				// Create new user
				await axios.post("/api/admin/users", formData);
				toast({
					title: "User created",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
			}

			onClose();
			queryClient.invalidateQueries({ queryKey: ["users"] });
		} catch (err: any) {
			toast({
				title: "Error",
				description: err.response?.data?.error || "Failed to save user",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
	};

	// Handle delete
	const handleDelete = async (id: string, email: string) => {
		if (!confirm(`Are you sure you want to delete user ${email}?`)) {
			return;
		}

		try {
			await axios.delete(`/api/admin/users/${id}`);
			toast({
				title: "User deleted",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
			queryClient.invalidateQueries({ queryKey: ["users"] });
		} catch (err: any) {
			toast({
				title: "Error",
				description: err.response?.data?.error || "Failed to delete user",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
	};

	// Handle password reset
	const handleResetPassword = async (id: string, email: string) => {
		if (!confirm(`Send password reset email to ${email}?`)) {
			return;
		}

		try {
			await axios.post(`/api/admin/users/${id}/reset-password`);
			toast({
				title: "Password reset email sent",
				description: `A password reset link has been sent to ${email}`,
				status: "success",
				duration: 5000,
				isClosable: true,
			});
		} catch (err: any) {
			toast({
				title: "Error",
				description: err.response?.data?.error || "Failed to send reset email",
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
						User Management
					</Heading>
					<Button colorScheme="blue" onClick={() => handleOpenModal()}>
						Create User
					</Button>
				</Flex>

				{error && (
					<Alert status="error" mb={4}>
						<AlertIcon />
						<AlertDescription>{error.message}</AlertDescription>
					</Alert>
				)}

				{users && users.length === 0 ? (
					<Text>No users found. Create one to get started!</Text>
				) : (
					<Table variant="striped" colorScheme="gray">
						<Thead>
							<Tr>
								<Th>Name</Th>
								<Th>Email</Th>
								<Th>Role</Th>
								<Th>Type</Th>
								<Th>Orders</Th>
								<Th>Actions</Th>
							</Tr>
						</Thead>
						<Tbody>
							{users?.map((user) => (
								<Tr key={user.id}>
									<Td>
										{user.firstName} {user.lastName}
									</Td>
									<Td>{user.email}</Td>
									<Td>
										<Badge colorScheme={user.role === "admin" ? "purple" : "blue"}>
											{user.role || "user"}
										</Badge>
									</Td>
									<Td>
										<Badge colorScheme={user.type === "guest" ? "gray" : "green"}>
											{user.type || "registered"}
										</Badge>
									</Td>
									<Td>{user._count.orders}</Td>
									<Td>
										<HStack spacing={2}>
											<IconButton
												aria-label="Edit"
												icon={<EditIcon />}
												size="sm"
												onClick={() => handleOpenModal(user)}
											/>
											<Button
												size="sm"
												colorScheme="orange"
												onClick={() => handleResetPassword(user.id, user.email)}>
												Reset Password
											</Button>
											<IconButton
												aria-label="Delete"
												icon={<DeleteIcon />}
												size="sm"
												colorScheme="red"
												onClick={() => handleDelete(user.id, user.email)}
											/>
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
					<ModalHeader>{editingUser ? "Edit User" : "Create User"}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<VStack spacing={4}>
							<FormControl isRequired>
								<FormLabel>Email</FormLabel>
								<Input
									type="email"
									placeholder="user@example.com"
									value={formData.email}
									onChange={(e) => setFormData({ ...formData, email: e.target.value })}
								/>
							</FormControl>

							<FormControl isRequired>
								<FormLabel>First Name</FormLabel>
								<Input
									placeholder="John"
									value={formData.firstName}
									onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
								/>
							</FormControl>

							<FormControl isRequired>
								<FormLabel>Last Name</FormLabel>
								<Input
									placeholder="Doe"
									value={formData.lastName}
									onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
								/>
							</FormControl>

							{!editingUser && (
								<FormControl isRequired>
									<FormLabel>Password</FormLabel>
									<Input
										type="password"
										placeholder="Min 8 characters"
										value={formData.password}
										onChange={(e) => setFormData({ ...formData, password: e.target.value })}
									/>
								</FormControl>
							)}

							<FormControl isRequired>
								<FormLabel>Role</FormLabel>
								<Select
									value={formData.role}
									onChange={(e) => setFormData({ ...formData, role: e.target.value as "user" | "admin" })}>
									<option value="user">User</option>
									<option value="admin">Admin</option>
								</Select>
							</FormControl>
						</VStack>
					</ModalBody>

					<ModalFooter>
						<Button variant="ghost" mr={3} onClick={onClose}>
							Cancel
						</Button>
						<Button colorScheme="blue" onClick={handleSubmit}>
							{editingUser ? "Update" : "Create"}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Container>
	);
};

export default UsersPage;

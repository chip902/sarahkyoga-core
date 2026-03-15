"use client";

import { useState } from "react";
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
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useUsers, User } from "@/app/hooks/useUsers";
import { useQueryClient } from "@tanstack/react-query";
import AdminTable, { AdminColumn } from "@/app/components/admin/AdminTable";

const UsersPage = () => {
	const { data: users, isLoading, error } = useUsers();
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();
	const queryClient = useQueryClient();

	const [formData, setFormData] = useState({
		email: "",
		firstName: "",
		lastName: "",
		password: "",
		role: "user" as "user" | "admin",
	});

	const handleOpenModal = (user?: User) => {
		if (user) {
			setEditingUser(user);
			setFormData({ email: user.email, firstName: user.firstName || "", lastName: user.lastName || "", password: "", role: (user.role || "user") as "user" | "admin" });
		} else {
			setEditingUser(null);
			setFormData({ email: "", firstName: "", lastName: "", password: "", role: "user" });
		}
		onOpen();
	};

	const handleSubmit = async () => {
		try {
			if (editingUser) {
				const { password, ...updateData } = formData;
				await axios.patch(`/api/admin/users/${editingUser.id}`, updateData);
				toast({ title: "User updated", status: "success", duration: 3000, isClosable: true });
			} else {
				await axios.post("/api/admin/users", formData);
				toast({ title: "User created", status: "success", duration: 3000, isClosable: true });
			}
			onClose();
			queryClient.invalidateQueries({ queryKey: ["users"] });
		} catch (err: unknown) {
			toast({ title: "Error", description: (axios.isAxiosError(err) && err.response?.data?.error) as string | undefined || "Failed to save user", status: "error", duration: 5000, isClosable: true });
		}
	};

	const handleDelete = async (id: string, email: string) => {
		if (!confirm(`Are you sure you want to delete user ${email}?`)) return;
		try {
			await axios.delete(`/api/admin/users/${id}`);
			toast({ title: "User deleted", status: "success", duration: 3000, isClosable: true });
			queryClient.invalidateQueries({ queryKey: ["users"] });
		} catch (err: unknown) {
			toast({ title: "Error", description: (axios.isAxiosError(err) && err.response?.data?.error) as string | undefined || "Failed to delete user", status: "error", duration: 5000, isClosable: true });
		}
	};

	const handleResetPassword = async (id: string, email: string) => {
		if (!confirm(`Send password reset email to ${email}?`)) return;
		try {
			await axios.post(`/api/admin/users/${id}/reset-password`);
			toast({ title: "Password reset email sent", description: `A password reset link has been sent to ${email}`, status: "success", duration: 5000, isClosable: true });
		} catch (err: unknown) {
			toast({ title: "Error", description: (axios.isAxiosError(err) && err.response?.data?.error) as string | undefined || "Failed to send reset email", status: "error", duration: 5000, isClosable: true });
		}
	};

	const columns: AdminColumn<User>[] = [
		{
			key: "firstName",
			label: "Name",
			sortable: true,
			filterable: true,
			render: (_, row) => `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim() || "—",
		},
		{ key: "email", label: "Email", sortable: true, filterable: true },
		{
			key: "role",
			label: "Role",
			sortable: true,
			render: (val) => <Badge colorScheme={val === "admin" ? "purple" : "blue"}>{(val as string) || "user"}</Badge>,
		},
		{
			key: "type",
			label: "Type",
			sortable: true,
			render: (val) => <Badge colorScheme={val === "guest" ? "gray" : "green"}>{(val as string) || "registered"}</Badge>,
		},
		{
			key: "_count.orders",
			label: "Orders",
			sortable: true,
			sortType: "number",
			render: (_, row) => String((row._count as { orders: number }).orders),
		},
		{
			key: "actions",
			label: "Actions",
			render: (_, row) => (
				<HStack spacing={2}>
					<IconButton aria-label="Edit" icon={<EditIcon />} size="sm" onClick={() => handleOpenModal(row)} />
					<Button size="sm" colorScheme="orange" onClick={() => handleResetPassword(row.id, row.email)}>
						Reset Password
					</Button>
					<IconButton aria-label="Delete" icon={<DeleteIcon />} size="sm" colorScheme="red" onClick={() => handleDelete(row.id, row.email)} />
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

				<AdminTable
					columns={columns}
					data={users || []}
					pageSize={15}
					searchPlaceholder="Search users..."
					emptyMessage="No users found. Create one to get started!"
				/>
			</Box>

			<Modal isOpen={isOpen} onClose={onClose} size="lg">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>{editingUser ? "Edit User" : "Create User"}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<VStack spacing={4}>
							<FormControl isRequired>
								<FormLabel>Email</FormLabel>
								<Input type="email" placeholder="user@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
							</FormControl>
							<FormControl isRequired>
								<FormLabel>First Name</FormLabel>
								<Input placeholder="John" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
							</FormControl>
							<FormControl isRequired>
								<FormLabel>Last Name</FormLabel>
								<Input placeholder="Doe" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
							</FormControl>
							{!editingUser && (
								<FormControl isRequired>
									<FormLabel>Password</FormLabel>
									<Input type="password" placeholder="Min 8 characters" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
								</FormControl>
							)}
							<FormControl isRequired>
								<FormLabel>Role</FormLabel>
								<Select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as "user" | "admin" })}>
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

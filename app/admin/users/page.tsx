// app/admin/users/page.tsx
"use client";
import { Table, Tbody, Td, Th, Thead, Tr, Button, Container } from "@chakra-ui/react";
import User from "@/prisma/client";
import axios from "axios";

const Users = () => {
	// You'd fetch this data from your API in a real app
	const users = [
		{ id: 1, name: "User One", email: "userone@example.com" },
		{ id: 2, name: "User Two", email: "usertwo@example.com" },
	];
	const handleDelete = async (id: number) => {
		try {
			await axios.delete(`/api/users/${id}`);
			// assuming after deletion, you want to refresh the list of users
			// you would make a fetch call here to get updated data or
			// filter out deleted user from the current array depending upon your needs
		} catch (error) {
			console.error("Error deleting user:", error);
		}
	};

	const handleUpdate = async (id: number, updatedData: typeof User) => {
		try {
			await axios.put(`/api/users/${id}`, updatedData);
			// assuming after updating, you want to refresh the list of users
			// you would make a fetch call here to get updated data or
			// update user in the current array depending upon your needs
		} catch (error) {
			console.error("Error updating user:", error);
		}
	};

	return (
		<Container mt={80}>
			<Table variant="simple">
				<Thead>
					<Tr>
						<Th>Name</Th>
						<Th>Email</Th>
						<Th>Actions</Th>
					</Tr>
				</Thead>
				<Tbody>
					{users.map((user) => (
						<Tr key={user.id}>
							<Td>{user.name}</Td>
							<Td>{user.email}</Td>
							<Td>
								<Button colorScheme="blue" mr={2}>
									Edit
								</Button>
								<Button colorScheme="red" onClick={() => handleDelete(user.id)}>
									Delete
								</Button>
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</Container>
	);
};

export default Users;

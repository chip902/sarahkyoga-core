// app/admin/users/page.tsx
"use client";
import { Button, Container, TableRoot, TableHeader, TableRow, TableColumnHeader, TableBody, TableCell } from "@chakra-ui/react";
import { User } from "@prisma/client";
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

	const handleUpdate = async (id: number, updatedData: User) => {
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
			<TableRoot>
				<TableHeader>
					<TableRow>
						<TableColumnHeader>Name</TableColumnHeader>
						<TableColumnHeader>Email</TableColumnHeader>
						<TableColumnHeader>Actions</TableColumnHeader>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.map((user) => (
						<TableRow key={user.id}>
							<TableCell>{user.name}</TableCell>
							<TableCell>{user.email}</TableCell>
							<TableCell>
								<Button colorScheme="blue" mr={2}>
									Edit
								</Button>
								<Button colorScheme="red" onClick={() => handleDelete(user.id)}>
									Delete
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</TableRoot>
		</Container>
	);
};

export default Users;

// app/admin/users/page.tsx

import { Table, Tbody, Td, Th, Thead, Tr, Button, Container } from "@chakra-ui/react";

const Users = () => {
	// You'd fetch this data from your API in a real app
	const users = [
		{ id: 1, name: "User One", email: "userone@example.com" },
		{ id: 2, name: "User Two", email: "usertwo@example.com" },
	];

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
								<Button colorScheme="red">Delete</Button>
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</Container>
	);
};

export default Users;

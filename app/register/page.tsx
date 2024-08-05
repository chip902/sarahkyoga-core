"use client";
import React from "react";
import { useState } from "react";
import axios from "axios";
import { Button, Container, Divider, Flex, FormControl, FormLabel, Heading, Input, Stack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const Register = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const router = useRouter();

	const handleRegister = async (e: any) => {
		e.preventDefault();

		try {
			const response = await axios.post("/api/auth/new-user", {
				email,
				password,
				name,
			});

			if (response.status === 200) {
				router.push("/login");
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Container as="form" maxW="md" py={{ base: "12", md: "24" }} mt={80} bgColor="brand.600" borderRadius={20} onSubmit={handleRegister}>
			<Stack spacing="6">
				<Stack spacing={{ base: "2", md: "3" }} textAlign="center">
					<Heading size={{ base: "xs", md: "sm" }}>Sign Up!</Heading>
				</Stack>
			</Stack>
			<Stack spacing="6" direction={{ base: "column", md: "row" }}>
				<FormControl id="name">
					<FormLabel>Name</FormLabel>
					<Input defaultValue="Name" onChange={(e) => setName(e.target.value)} value={name} />
				</FormControl>
				<FormControl id="email">
					<FormLabel>Email</FormLabel>
					<Input defaultValue="Email" onChange={(e) => setEmail(e.target.value)} value={email} />
				</FormControl>
			</Stack>
			<FormControl id="password">
				<FormLabel>Password</FormLabel>
				<Input defaultValue="Password" onChange={(e) => setPassword(e.target.value)} value={password} type="password" />
			</FormControl>

			<Divider />
			<Flex direction="row-reverse" py="4" px={{ base: "4", md: "6" }}>
				<Button type="submit">Submit</Button>
			</Flex>
		</Container>
	);
};
export default Register;

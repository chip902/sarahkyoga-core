"use client";
import React from "react";
import { useState } from "react";
import axios from "axios";
import { Button, Container, Divider, Flex, FormControl, FormLabel, Heading, Input, Modal, Spinner, Stack, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const Register = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const toast = useToast();

	const handleRegister = async (e: any) => {
		e.preventDefault();

		try {
			setIsLoading(true);
			const response = await axios.post("/api/auth/new-user", {
				email,
				password,
				firstName,
				lastName,
			});

			if (response.status === 201) {
				setIsLoading(false);
				router.push("/dashboard");
			}
		} catch (error) {
			console.error(error);
			toast({
				title: "Error creating account!",
				description: (error instanceof Error ? error.message : "Unknown error occurred") + ". Please try again",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
			setIsLoading(false);
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
				<Flex mb={{ base: 4, md: 2 }} justifyContent="space-between">
					<FormControl isRequired width="50%" id="firstName" mr={2}>
						<FormLabel fontFamily="inherit">First Name</FormLabel>
						<Input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
					</FormControl>
					<FormControl isRequired width="50%" ml={2} id="lastName">
						<FormLabel fontFamily="inherit">Last Name</FormLabel>
						<Input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
					</FormControl>
				</Flex>
				<FormControl id="email">
					<FormLabel>Email</FormLabel>
					<Input value={email} onChange={(e) => setEmail(e.target.value)} />
				</FormControl>
			</Stack>
			<FormControl id="password">
				<FormLabel>Password</FormLabel>
				<Input onChange={(e) => setPassword(e.target.value)} value={password} type="password" />
			</FormControl>

			<Divider />
			<Flex direction="row-reverse" py="4" px={{ base: "4", md: "6" }}>
				<Button type="submit" disabled={isLoading}>
					Submit{isLoading && <Spinner />}
				</Button>
			</Flex>
		</Container>
	);
};
export default Register;

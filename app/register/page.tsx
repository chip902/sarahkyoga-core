"use client";
import { useState } from "react";
import axios from "axios";
import { Box, Button, Container, Divider, Flex, FormControl, FormLabel, Heading, Input, Modal, Spinner, Stack, useToast } from "@chakra-ui/react";
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
		<Box w="100%" pt={{ base: "200", md: "28" }} display="flex" justifyContent="center" alignItems="flex-start">
			<Container
				maxW="md"
				py={{ base: "8", md: "12" }}
				px={{ base: "8", md: "10" }}
				mt={{ base: "20", md: "32" }}
				mb={{ base: "6", md: "24" }}
				bgColor="brand.600"
				borderRadius={20}
				position="relative"
				zIndex="1"
				mx="auto"
				display="block">
				<form onSubmit={handleRegister}>
					<Stack spacing={{ base: "4", md: "6" }}>
						<Stack spacing={{ base: "2", md: "3" }} textAlign="center">
							<Heading size={{ base: "md", md: "sm" }}>Sign Up!</Heading>
						</Stack>

						<Stack spacing={{ base: "3", md: "4" }}>
							<Flex direction={{ base: "column", md: "row" }} mb={2} gap={{ base: "3", md: "4" }}>
								<FormControl isRequired id="firstName">
									<FormLabel fontFamily="inherit">First Name</FormLabel>
									<Input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
								</FormControl>
								<FormControl isRequired id="lastName">
									<FormLabel fontFamily="inherit">Last Name</FormLabel>
									<Input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
								</FormControl>
							</Flex>

							<FormControl isRequired id="email">
								<FormLabel>Email</FormLabel>
								<Input value={email} onChange={(e) => setEmail(e.target.value)} />
							</FormControl>

							<FormControl isRequired id="password">
								<FormLabel>Password</FormLabel>
								<Input onChange={(e) => setPassword(e.target.value)} value={password} type="password" />
							</FormControl>

							<Divider my={4} />

							<Flex justify="flex-end" py={{ base: "8", md: "4" }}>
								<Button type="submit" disabled={isLoading} colorScheme="blue">
									{isLoading ? <Spinner size="sm" mr={2} /> : null}
									Submit
								</Button>
							</Flex>
						</Stack>
					</Stack>
				</form>
			</Container>
		</Box>
	);
};
export default Register;

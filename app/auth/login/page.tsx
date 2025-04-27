"use client";
import { useState } from "react";
import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Box,
	Button,
	Checkbox,
	Container,
	FormControl,
	FormLabel,
	Heading,
	HStack,
	Input,
	Link,
	Stack,
	Text,
} from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import { GoogleIcon } from "./ProviderIcons";
import { useRouter } from "next/navigation";

const Login = () => {
	// State to store email and password
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { data: session, status } = useSession();
	const router = useRouter();

	const handleLogin = async () => {
		// Perform the sign-in with credentials
		const result = await signIn("credentials", {
			email,
			password,
		});
		if (result?.error) {
			// Handle login error
			console.error("Login failed:", result.error);
			return (
				<Alert status="error" variant="account" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="200px">
					<AlertIcon boxSize="40px" mr={0} />
					<AlertTitle mt={4} mb={1} fontSize="lg">
						Access Denied
					</AlertTitle>
					<AlertDescription maxWidth="sm">Your Email or Password was not found; please try again.</AlertDescription>
				</Alert>
			);
		}
		if (status === "authenticated" && session.user.role === "admin") {
			router.push("/admin/dashboard");
		} else {
			router.push("/dashboard");
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
				<Stack spacing={{ base: "6", md: "8" }}>
					<Stack spacing={{ base: "4", md: "6" }}>
						<Stack spacing={{ base: "2", md: "3" }} textAlign="center">
							<Heading variant="login" size={{ base: "lg", md: "sm" }}>
								Log in to your account
							</Heading>
						</Stack>
					</Stack>

					<Stack spacing={{ base: 4, md: 6 }}>
						<Stack spacing={{ base: 4, md: 5 }}>
							<FormControl>
								<FormLabel htmlFor="email">Email</FormLabel>
								<Input id="email" placeholder="Enter your email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
							</FormControl>
							<FormControl>
								<FormLabel htmlFor="password">Password</FormLabel>
								<Input id="password" placeholder="********" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
							</FormControl>
						</Stack>

						<HStack justify="space-between">
							<Checkbox defaultChecked>Remember me</Checkbox>
							<Link color="black" href="/auth/forgot-password" fontSize={{ base: "sm", md: "md" }}>
								Forgot Password?
							</Link>
						</HStack>

						<Stack spacing={{ base: "3", md: "4" }}>
							<Button onClick={handleLogin}>Sign in</Button>
							<Button variant="secondary" leftIcon={<GoogleIcon />} onClick={() => signIn("google")}>
								Sign in with Google
							</Button>
						</Stack>
					</Stack>

					<Text textAlign="center" fontSize={{ base: "sm", md: "md" }}>
						<Link color="black" href="/register">
							Don&apos;t have an account? Sign up
						</Link>
					</Text>
				</Stack>
			</Container>
		</Box>
	);
};

export default Login;

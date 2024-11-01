"use client";
import { useState } from "react";
import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
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
import { signIn } from "next-auth/react";
import { GoogleIcon } from "./ProviderIcons";

const Login = () => {
	// State to store email and password
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async () => {
		// Perform the sign-in with credentials
		const result = await signIn("credentials", {
			email,
			password,
			callbackUrl: "/dashboard",
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
	};

	return (
		<Container maxW="md" py={{ base: "12", md: "24" }} mt={80} bgColor="brand.600" borderRadius={20}>
			<Stack spacing="8">
				<Stack spacing="6">
					<Stack spacing={{ base: "2", md: "3" }} textAlign="center">
						<Heading variant="login" size={{ base: "xs", md: "sm" }}>
							Log in to your account
						</Heading>
					</Stack>
				</Stack>
				<Stack spacing="6">
					<Stack spacing="5">
						<FormControl>
							<FormLabel htmlFor="email">Email</FormLabel>
							<Input
								id="email"
								placeholder="Enter your email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)} // Capture email input
							/>
						</FormControl>
						<FormControl>
							<FormLabel htmlFor="password">Password</FormLabel>
							<Input
								id="password"
								placeholder="********"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)} // Capture password input
							/>
						</FormControl>
					</Stack>
					<HStack justify="space-between">
						<Checkbox defaultChecked>Remember me</Checkbox>
						<Link color="black" href="/auth/forgot-password">
							Forgot Password?
						</Link>
					</HStack>
					<Stack spacing="4">
						<Button onClick={handleLogin}>Sign in</Button>
						<Button variant="secondary" leftIcon={<GoogleIcon />} onClick={() => signIn("google")}>
							Sign in with Google
						</Button>
					</Stack>
				</Stack>
				<Text textStyle="sm" color="fg.muted">
					<Link color="black" href="/register">
						Don&apos;t have an account? Sign up
					</Link>
				</Text>
			</Stack>
		</Container>
	);
};

export default Login;

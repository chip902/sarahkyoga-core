"use client";
import { useState } from "react";
import { AlertDescription, AlertRoot, AlertTitle, Button, Container, Heading, HStack, Input, Link, Stack, Text } from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import { GoogleIcon } from "./ProviderIcons";
import { useRouter } from "next/navigation";
import { Field } from "@/src/components/ui/field";
import { Checkbox } from "@/src/components/ui/checkbox";

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
				<AlertRoot status="error" variant="solid" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="200px">
					<AlertTitle mt={4} mb={1} fontSize="lg">
						Access Denied
					</AlertTitle>
					<AlertDescription maxWidth="sm">Your Email or Password was not found; please try again.</AlertDescription>
				</AlertRoot>
			);
		}
		if (status === "authenticated" && session.user.role === "admin") {
			router.push("/admin/dashboard");
		} else {
			router.push("/dashboard");
		}
	};

	return (
		<Container maxW="md" py={{ base: "12", md: "24" }} mt={80} bgColor="brand.600" borderRadius={20}>
			<Stack gap="8">
				<Stack gap="6">
					<Stack gap={{ base: "2", md: "3" }} textAlign="center">
						<Heading size={{ base: "xs", md: "sm" }}>Log in to your account</Heading>
					</Stack>
				</Stack>
				<Stack gap="6">
					<Stack gap="5">
						<form>
							<Field>Email</Field>
							<Input
								id="email"
								placeholder="Enter your email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)} // Capture email input
							/>
							<Field>Password</Field>
							<Input
								id="password"
								placeholder="********"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)} // Capture password input
							/>
						</form>
					</Stack>
					<HStack justify="space-between">
						<Checkbox variant="outline">Remember me</Checkbox>
						<Link color="black" href="/auth/forgot-password">
							Forgot Password?
						</Link>
					</HStack>
					<Stack gap="4">
						<Button onClick={handleLogin}>Sign in</Button>
						<Button variant="outline" onClick={() => signIn("google")}>
							<GoogleIcon /> Sign in with Google
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

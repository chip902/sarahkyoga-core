import { Button, Checkbox, Container, FormControl, FormLabel, Heading, HStack, Image, Input, Link, Stack, Text } from "@chakra-ui/react";
import { GoogleIcon } from "./ProviderIcons";

export const App = () => (
	<Container maxW="md" py={{ base: "12", md: "24" }} mt={80} bgColor="brand.600" borderRadius={20}>
		<Stack spacing="8">
			<Stack spacing="6">
				<Stack spacing={{ base: "2", md: "3" }} textAlign="center">
					<Heading size={{ base: "xs", md: "sm" }}>Log in to your account</Heading>
				</Stack>
			</Stack>
			<Stack spacing="6">
				<Stack spacing="5">
					<FormControl>
						<FormLabel htmlFor="email">Email</FormLabel>
						<Input id="email" placeholder="Enter your email" type="email" />
					</FormControl>
					<FormControl>
						<FormLabel htmlFor="password">Password</FormLabel>
						<Input id="password" placeholder="********" type="password" />
					</FormControl>
				</Stack>
				<HStack justify="space-between">
					<Checkbox defaultChecked>Remember me</Checkbox>
					<Button variant="text" size="sm">
						Forgot password
					</Button>
				</HStack>
				<Stack spacing="4">
					<Button>Sign in</Button>
					<Button variant="secondary" leftIcon={<GoogleIcon />}>
						Sign in with Google
					</Button>
				</Stack>
			</Stack>
			<Text textStyle="sm" color="fg.muted">
				<Link color="black" href="#">
					Don&apos;t have an account? Sign up
				</Link>
			</Text>
		</Stack>
	</Container>
);
export default App;

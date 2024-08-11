"use client";
import { Button, Menu, MenuButton, MenuItem, MenuList, Avatar, Box, HStack } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const UserMenu = () => {
	const { data: session } = useSession();

	const handleSignOut = async () => {
		await signOut({
			callbackUrl: "/", // Redirect to homepage after sign out
		});
	};

	return (
		<Box mt={80}>
			{session ? (
				<Menu>
					<MenuButton as={Button} variant="ghost" rounded="full" cursor="pointer" minW={0}>
						<Avatar size="sm" name={session.user?.name || "User"} src={session.user?.image || ""} />
					</MenuButton>
					<MenuList>
						<MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
					</MenuList>
				</Menu>
			) : (
				<HStack spacing={4}>
					<Button as="a" href="/auth/login" colorScheme="teal">
						Sign In
					</Button>
					<Button as="a" href="/auth/register" colorScheme="blue">
						Sign Up
					</Button>
				</HStack>
			)}
		</Box>
	);
};

export default UserMenu;

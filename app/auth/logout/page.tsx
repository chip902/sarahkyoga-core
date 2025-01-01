"use client";
import { Avatar } from "@/src/components/ui/avatar";
import { MenuRoot, MenuTrigger, MenuItem } from "@/src/components/ui/menu";
import NextLink from "next/link";
import { Button, Box, HStack } from "@chakra-ui/react";
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
				<MenuRoot>
					<MenuTrigger as={Button} rounded="full" cursor="pointer" minW={0}>
						<Avatar size="sm" name={session.user?.name || "User"} src={session.user?.image || ""} />
					</MenuTrigger>

					<MenuItem value="sign-out" onClick={handleSignOut}>
						Sign Out
					</MenuItem>
				</MenuRoot>
			) : (
				<HStack gap={4}>
					<NextLink href="/bookauth/login" passHref legacyBehavior>
						<Button as="a" colorScheme="blue">
							Sign In
						</Button>
					</NextLink>
					<NextLink href="/auth/register">
						<Button as="a" colorScheme="blue">
							Sign Up
						</Button>
					</NextLink>
				</HStack>
			)}
		</Box>
	);
};

export default UserMenu;

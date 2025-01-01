"use client";
import { Box, Button, Grid, HStack, IconButton, Image, Spinner, Stack, VStack, useDisclosure } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import ShoppingCartPopout from "./components/ShoppingCartPopout";
import { GiHamburgerMenu } from "react-icons/gi";
import { ChevronDownIcon } from "lucide-react";
import { MenuRoot, MenuTrigger, MenuItem, MenuItemGroup } from "@/src/components/ui/menu";
import { DrawerRoot, DrawerTrigger, DrawerContent, DrawerHeader, DrawerBody } from "@/src/components/ui/drawer";
import { AccordionItem, AccordionRoot, AccordionItemTrigger } from "@/src/components/ui/accordion";

interface NavBarProps {
	isResponsive: boolean;
}

const NavBar = ({ isResponsive }: NavBarProps) => {
	const { open, onOpen, onClose } = useDisclosure();
	const [menuOpen, setMenuOpen] = useState(false);
	const closeTimeoutRef = useRef<number | null>(null);
	const { status, data: session } = useSession();

	const openMenu = () => {
		if (closeTimeoutRef.current !== null) {
			clearTimeout(closeTimeoutRef.current);
		}
		setMenuOpen(true);
	};

	const closeMenu = () => {
		closeTimeoutRef.current = window.setTimeout(() => {
			setMenuOpen(false);
		}, 80) as number;
	};

	const handleSignOut = () => {
		signOut({ callbackUrl: "/" });
	};

	if (!isResponsive) {
		return (
			<Box as="nav" position="fixed" width="100%" zIndex="10" bgColor="#000000" color="brand.100">
				<Grid templateColumns="1fr auto 1fr" alignItems="center" gap={4} px={4} py={2}>
					<Box height="100%" />
					<Box display="flex">
						<Image src="/sky_banner.webp" h="20vh" alt="Logo" />
					</Box>
					<Box display="flex" justifyContent="flex-end" alignItems="center" px={10}>
						<NextLink href="/" passHref legacyBehavior>
							<Button as="a" height="100%" lineHeight="1.2" p={1} backgroundColor="transparent" flex={1} mx={5}>
								Home
							</Button>
						</NextLink>
						<NextLink href="/about" passHref legacyBehavior>
							<Button as="a" height="100%" lineHeight="1.2" p={1} backgroundColor="transparent" flex={1} mx={5}>
								About
							</Button>
						</NextLink>
						<MenuRoot open={menuOpen} onExitComplete={closeMenu}>
							<MenuItemGroup>
								<MenuItem
									value="schedule"
									fontSize="lg"
									as={Button}
									height="normal"
									lineHeight="1.2"
									backgroundColor="transparent"
									onMouseEnter={openMenu}
									onMouseLeave={closeMenu}
									_focus={{ outline: "none", boxShadow: "none" }}>
									<ChevronDownIcon />
									Schedule
								</MenuItem>
								<MenuItem value="menu-toggle" onMouseEnter={openMenu} onMouseLeave={closeMenu}>
									<VStack py="10px">
										<NextLink href="/classes" passHref legacyBehavior>
											<Button as="a" onClick={onClose} my={5}>
												All Classes
											</Button>
										</NextLink>
										<NextLink href="/booking" passHref legacyBehavior>
											<Button as="a" onClick={onClose} my={5}>
												Private Sessions
											</Button>
										</NextLink>
										<HStack>
											<NextLink href="/workshops" passHref legacyBehavior>
												<Button as="a" onClick={onClose} my={5}>
													Workshops
												</Button>
											</NextLink>
										</HStack>
									</VStack>
								</MenuItem>
							</MenuItemGroup>
						</MenuRoot>
						<NextLink href="/contact" passHref legacyBehavior>
							<Button as="a" height="100%" lineHeight="1.2" p={0} backgroundColor="transparent" flex={1} mx={5} marginRight={35}>
								Contact
							</Button>
						</NextLink>
						{status === "loading" ? (
							<Spinner size="lg" marginRight={70} />
						) : status === "authenticated" && session?.user.role === "admin" ? (
							<MenuRoot>
								<MenuTrigger>
									<Button as={Button} marginRight={70}>
										<ChevronDownIcon />
										Admin
									</Button>
								</MenuTrigger>
								<MenuItemGroup>
									<NextLink href="/admin/dashboard" passHref legacyBehavior>
										<MenuItem value="dashboard">Dashboard</MenuItem>
									</NextLink>
									<NextLink href="/admin/users" passHref legacyBehavior>
										<MenuItem value="manage-users">Manage Users</MenuItem>
									</NextLink>
									<NextLink href="/admin/dashboard/workshop" passHref legacyBehavior>
										<MenuItem value="manage-workshops">Manage Workshops</MenuItem>
									</NextLink>
									<NextLink href="/admin/newsletter" passHref legacyBehavior>
										<MenuItem value="newsletter">Newsletter</MenuItem>
									</NextLink>
									<MenuItem value="sign-out" onClick={handleSignOut}>
										Sign Out
									</MenuItem>
								</MenuItemGroup>
							</MenuRoot>
						) : status === "authenticated" ? (
							<Button height="100%" lineHeight="1.2" p={0} backgroundColor="transparent" flex={1} mx={5} marginRight={70} onClick={handleSignOut}>
								Sign Out
							</Button>
						) : (
							<NextLink href="/auth/login" passHref legacyBehavior>
								<Button as="a" height="100%" lineHeight="1.2" p={0} backgroundColor="transparent" flex={1} mx={5} marginRight={70}>
									Sign In
								</Button>
							</NextLink>
						)}

						<ShoppingCartPopout isResponsive={isResponsive} />
					</Box>
				</Grid>
			</Box>
		);
	} else {
		return (
			<nav>
				<Grid templateColumns="1fr auto 1fr" alignItems="center" gap={4} px={4} py={2} bgColor="#000000" color="brand.100">
					<Box height="100%" />
					<Box>
						<Image src="/sky_banner.webp" h="20vh" alt="Logo" />
					</Box>
					<Box>
						<MenuRoot>
							<MenuItem value="menu-toggle">
								<Button alignItems="center" as={IconButton} aria-label="Open menu" variant="outline" onClick={onOpen} value="toggle menu" />
								<GiHamburgerMenu />
							</MenuItem>
						</MenuRoot>
					</Box>
					<DrawerRoot open={open} placement="start" closeOnInteractOutside>
						<DrawerTrigger />
						<DrawerContent flexDirection="column">
							<DrawerHeader textAlign="center" as="h2" borderBottomWidth="1px">
								Sarah K Yoga
							</DrawerHeader>
							<DrawerBody textAlign="left" flexDirection="column">
								<Stack direction="column" gap={4}>
									<NextLink href="/" passHref legacyBehavior>
										<Button onClick={onClose}>Home</Button>
									</NextLink>
									<NextLink href="/about" passHref legacyBehavior>
										<Button onClick={onClose}>About Me</Button>
									</NextLink>
									<AccordionRoot collapsible>
										<AccordionItem value="schedule" border="none">
											<AccordionItemTrigger>
												<Box as="span" flex="1" textAlign="left" fontWeight="semibold">
													Schedule
												</Box>
												<GiHamburgerMenu />
											</AccordionItemTrigger>
											<AccordionItemTrigger pb={4}>
												<NextLink href="/classes" passHref legacyBehavior>
													<Button onClick={onClose}>All Classes</Button>
												</NextLink>
												<NextLink href="/booking" passHref legacyBehavior>
													<Button onClick={onClose}>Private Sessions</Button>
												</NextLink>
												<NextLink href="/workshops" passHref legacyBehavior>
													<Button onClick={onClose}>Workshops</Button>
												</NextLink>
											</AccordionItemTrigger>
										</AccordionItem>
									</AccordionRoot>
									<NextLink href="/contact" passHref legacyBehavior>
										<Button onClick={onClose}>Contact</Button>
									</NextLink>
									{status === "loading" ? (
										<Spinner size="lg" marginRight={70} />
									) : status === "authenticated" ? (
										<Button onClick={handleSignOut}>Sign Out</Button>
									) : (
										<NextLink href="/auth/login" passHref legacyBehavior>
											<Button onClick={onClose}>Sign In</Button>
										</NextLink>
									)}
								</Stack>
							</DrawerBody>
						</DrawerContent>
					</DrawerRoot>
				</Grid>
			</nav>
		);
	}
};

export default NavBar;

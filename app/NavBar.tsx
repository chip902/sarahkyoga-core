"use client";
import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
	Button,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	Grid,
	HStack,
	Icon,
	IconButton,
	Image,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Spinner,
	Stack,
	VStack,
	useDisclosure,
} from "@chakra-ui/react";
import { GiEmptyHourglass } from "react-icons/gi";
import NextLink from "next/link";
import { useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import ShoppingCartPopout from "./components/ShoppingCartPopout";

interface NavBarProps {
	isResponsive: boolean;
}

const NavBar = ({ isResponsive }: NavBarProps) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
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
						<NextLink href="/" passHref>
							<Button height="100%" lineHeight="1.2" p={1} backgroundColor="transparent" flex={1} variant="linkNav" mx={5}>
								Home
							</Button>
						</NextLink>
						<NextLink href="/about" passHref>
							<Button height="100%" lineHeight="1.2" p={1} backgroundColor="transparent" flex={1} variant="linkNav" mx={5}>
								About
							</Button>
						</NextLink>
						<Menu isOpen={menuOpen} onClose={closeMenu}>
							<MenuButton
								variant="linkNav"
								fontSize="lg"
								as={Button}
								height="normal"
								lineHeight="1.2"
								backgroundColor="transparent"
								rightIcon={<ChevronDownIcon height="100%" lineHeight="normal" boxSize="20px" />}
								onMouseEnter={openMenu}
								onMouseLeave={closeMenu}
								_focus={{ outline: "none", boxShadow: "none" }}>
								Schedule
							</MenuButton>
							<MenuList onMouseEnter={openMenu} onMouseLeave={closeMenu}>
								<VStack py="10px">
									<NextLink href="/classes" passHref>
										<Button variant="linkNav" onClick={onClose} my={5}>
											All Classes
										</Button>
									</NextLink>
									<NextLink href="/booking" passHref>
										<Button variant="linkNav" onClick={onClose} my={5}>
											Private Sessions
										</Button>
									</NextLink>
									<NextLink href="/workshops" passHref>
										<Button variant="linkNav" onClick={onClose} my={5}>
											Workshops
										</Button>
									</NextLink>
								</VStack>
							</MenuList>
						</Menu>
						<NextLink href="/contact" passHref>
							<Button height="100%" lineHeight="1.2" p={0} backgroundColor="transparent" flex={1} variant="linkNav" mx={5} marginRight={35}>
								Contact
							</Button>
						</NextLink>
						{status === "loading" ? (
							<Spinner size="lg" marginRight={70} />
						) : status === "authenticated" && session?.user.role === "admin" ? (
							<Menu>
								<MenuButton variant="linkNav" as={Button} rightIcon={<ChevronDownIcon />} marginRight={70}>
									Admin
								</MenuButton>
								<MenuList>
									<NextLink href="/admin/dashboard" passHref legacyBehavior>
										<MenuItem>Dashboard</MenuItem>
									</NextLink>
									<NextLink href="/admin/users" passHref legacyBehavior>
										<MenuItem>Manage Users</MenuItem>
									</NextLink>
									<NextLink href="/admin/promo-codes" passHref legacyBehavior>
										<MenuItem>Promo Codes</MenuItem>
									</NextLink>
									<NextLink href="/admin/newsletter" passHref legacyBehavior>
										<MenuItem>Newsletter</MenuItem>
									</NextLink>
									<MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
								</MenuList>
							</Menu>
						) : status === "authenticated" ? (
							<Button
								height="100%"
								lineHeight="1.2"
								p={0}
								backgroundColor="transparent"
								flex={1}
								variant="linkNav"
								mx={5}
								marginRight={70}
								onClick={handleSignOut}>
								Sign Out
							</Button>
						) : (
							<NextLink href="/auth/login" passHref>
								<Button height="100%" lineHeight="1.2" p={0} backgroundColor="transparent" flex={1} variant="linkNav" mx={5} marginRight={70}>
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
						<Menu>
							<MenuButton
								alignItems="center"
								as={IconButton}
								aria-label="Open menu"
								icon={<HamburgerIcon />}
								variant="outline"
								onClick={onOpen}
							/>
						</Menu>
					</Box>
					<Drawer isOpen={isOpen} placement="start" onClose={onClose}>
						<DrawerOverlay />
						<DrawerContent flexDirection="column">
							<DrawerHeader textAlign="center" as="h2" borderBottomWidth="1px">
								Sarah K Yoga
							</DrawerHeader>
							<DrawerBody textAlign="left" flexDirection="column">
								<Stack direction="column" spacing={4}>
									<NextLink href="/" passHref>
										<Button variant="mobileMenu" onClick={onClose}>
											Home
										</Button>
									</NextLink>
									<NextLink href="/about" passHref>
										<Button variant="mobileMenu" onClick={onClose}>
											About Me
										</Button>
									</NextLink>
									<Accordion allowToggle>
										<AccordionItem border="none">
											<AccordionButton>
												<Box as="span" flex="1" textAlign="left" fontWeight="semibold">
													Schedule
												</Box>
												<AccordionIcon />
											</AccordionButton>
											<AccordionPanel pb={4}>
												<NextLink href="/classes" passHref>
													<Button variant="mobileMenu" onClick={onClose}>
														All Classes
													</Button>
												</NextLink>
												<NextLink href="/booking" passHref>
													<Button variant="mobileMenu" onClick={onClose}>
														Private Sessions
													</Button>
												</NextLink>
												<NextLink href="/workshops" passHref>
													<Button variant="mobileMenu" onClick={onClose}>
														Workshops
													</Button>
												</NextLink>
											</AccordionPanel>
										</AccordionItem>
									</Accordion>
									<NextLink href="/contact" passHref>
										<Button variant="mobileMenu" onClick={onClose}>
											Contact
										</Button>
									</NextLink>
									{status === "loading" ? (
										<Spinner size="lg" marginRight={70} />
									) : status === "authenticated" ? (
										<Button variant="mobileMenu" onClick={handleSignOut}>
											Sign Out
										</Button>
									) : (
										<NextLink href="/auth/login" passHref>
											<Button variant="mobileMenu" onClick={onClose}>
												Sign In
											</Button>
										</NextLink>
									)}
								</Stack>
							</DrawerBody>
						</DrawerContent>
					</Drawer>
				</Grid>
			</nav>
		);
	}
};

export default NavBar;

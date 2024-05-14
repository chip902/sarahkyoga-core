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
	IconButton,
	Image,
	Menu,
	MenuButton,
	MenuList,
	Stack,
	useDisclosure,
	VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { Link as ChakraLink } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

const NavBar = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [menuOpen, setMenuOpen] = useState(false);
	const closeTimeoutRef = useRef<number | null>(null);
	const [isMobile, setIsMobile] = useState(false);

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

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 968);
		};

		handleResize();
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);
	if (!isMobile) {
		return (
			<nav>
				<Grid templateColumns="1fr auto 1fr" alignItems="center" gap={4} px={4} py={2} bgColor="#000000" color="brand.100">
					<Box display="flex" height="100%" />
					<Box display="flex">
						<Image src="/sky_banner.webp" h="20vh" alt="Logo" />
					</Box>
					<Box display="flex" justifyContent="flex-end" alignItems="center">
						<Link href="/" passHref>
							<ChakraLink as={Button} height="100%" lineHeight="1.2" p={1} backgroundColor="transparent" flex={1} variant="linkNav" mx={5}>
								Home
							</ChakraLink>
						</Link>
						<Link href="/about" passHref>
							<ChakraLink as={Button} height="100%" lineHeight="1.2" p={1} backgroundColor="transparent" flex={1} variant="linkNav" mx={5}>
								About
							</ChakraLink>
						</Link>
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
									<Link href="/all-classes">
										<ChakraLink flex={1} variant="linkNav" onClick={onClose} my={5}>
											All Classes
										</ChakraLink>
									</Link>
									<Link href="/private-sessions">
										<ChakraLink flex={1} variant="linkNav" onClick={onClose} my={5}>
											Private Sessions
										</ChakraLink>
									</Link>
									<Link href="/workshops">
										<ChakraLink flex={1} variant="linkNav" onClick={onClose} my={5}>
											Workshops
										</ChakraLink>
									</Link>
								</VStack>
							</MenuList>
						</Menu>
						<Link href="/contact">
							<ChakraLink
								height="100%"
								lineHeight="1.2"
								p={0}
								backgroundColor="transparent"
								as={Button}
								flex={1}
								variant="linkNav"
								mx={5}
								marginRight={70}>
								Contact
							</ChakraLink>
						</Link>
					</Box>
				</Grid>
			</nav>
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
									<Link href="/">
										<Button variant="mobileMenu" onClick={onClose}>
											Home
										</Button>
									</Link>
									<Link href="/about">
										<Button variant="mobileMenu" onClick={onClose}>
											About Me
										</Button>
									</Link>
									<Accordion allowToggle>
										<AccordionItem border="none">
											<AccordionButton>
												<Box as="span" flex="1" textAlign="left" fontWeight="semibold">
													Schedule
												</Box>
												<AccordionIcon />
											</AccordionButton>
											<AccordionPanel pb={4}>
												<Link href="/all-classes">
													<Button variant="mobileMenu" onClick={onClose}>
														All Classes
													</Button>
												</Link>
												<Link href="/private-sessions">
													<Button variant="mobileMenu" onClick={onClose}>
														Private Sessions
													</Button>
												</Link>
												<Link href="/workshops">
													<Button variant="mobileMenu" onClick={onClose}>
														Workshops
													</Button>
												</Link>
											</AccordionPanel>
										</AccordionItem>
									</Accordion>
									<Link href="/contact">
										<Button variant="mobileMenu" onClick={onClose}>
											Contact
										</Button>
									</Link>
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

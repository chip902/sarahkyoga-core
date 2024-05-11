"use client";
import { HamburgerIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	Flex,
	IconButton,
	Image,
	Spacer,
	useBreakpointValue,
	useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";

const NavBar = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const isMobile = useBreakpointValue({ base: true, lg: false });
	return (
		<Box borderRadius="lg" position="sticky" top={0} zIndex={1} w="100%" bg="brand.200">
			<Image src="sky_banner.webp" />
			<Flex
				borderRadius="lg"
				bg="brand.200"
				color="grey"
				as="nav"
				align="center"
				justify="space-between" // This keeps items aligned to the edges
				wrap="wrap"
				w="100%"
				h="60px"
				px={4} // Adjust padding as needed
			>
				{/* Spacer to push content to the center */}
				<Spacer mx={5} />

				{/* Centered Navigation Menu */}
				<Flex align="center" justify="center">
					<Button variant="linkNav">
						<Link href="/">Home</Link>
					</Button>
					<Button variant="linkNav">
						<Link href="#">About</Link>
					</Button>
					<Button variant="linkNav">
						<Link href="#">Contact</Link>
					</Button>
				</Flex>

				{/* Spacer to push content to the center */}
				<Spacer />

				{/* Hamburger Icon always visible */}
				<IconButton icon={<HamburgerIcon />} onClick={onOpen} variant="outline" aria-label="Open Menu" />

				{/* Drawer for additional navigation */}
				<Drawer placement="right" onClose={onClose} isOpen={isOpen}>
					<DrawerOverlay />
					<DrawerContent>
						<DrawerCloseButton />
						{isMobile ? (
							<>
								<DrawerHeader borderBottomWidth="1px">Navigation</DrawerHeader>
								<DrawerBody>
									<Flex flexDirection="column">
										<Button variant="drawer" onClick={onClose} mb={4}>
											<Link href="/">Home</Link>
										</Button>
										<Button variant="drawer" onClick={onClose} mb={4}>
											<Link href="/about">About</Link>
										</Button>
										<Button variant="drawer" onClick={onClose}>
											<Link href="/contact">Contact</Link>
										</Button>
									</Flex>
								</DrawerBody>
							</>
						) : (
							<>
								<DrawerHeader borderBottomWidth="1px">Rating</DrawerHeader>
								<DrawerBody>
									<Flex flexDirection="column">
										This is explaining the rating system. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit ullam enim
										laudantium voluptatibus, distinctio nam voluptas at ducimus suscipit quas libero, quia nesciunt perferendis tempora
										accusamus debitis quisquam aliquam expedita!
									</Flex>
								</DrawerBody>
							</>
						)}
						<DrawerFooter borderTopWidth="1px">
							<Button variant="outline" mr={3} onClick={onClose}>
								Close
							</Button>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>
			</Flex>
		</Box>
	);
};

export default NavBar;

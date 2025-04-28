// ProductItem.tsx
import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Heading,
	Text,
	VStack,
	Flex,
	Badge,
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	Center,
	Tag,
	HStack,
} from "@chakra-ui/react";
import { BookNowButton } from "./BookNow";

export interface ProductItemProps {
	product: {
		name: string;
		description: string | null;
		id: string;
		price: number;
	};
	quantity: number;
	key: string;
}

const ProductItem = ({ product }: ProductItemProps) => {
	// Modal control
	const { isOpen, onOpen, onClose } = useDisclosure();

	// Extract duration and type from product name if available
	const isDuration = product.name.match(/(\d+)\s*min/i);
	const duration = isDuration ? isDuration[1] : null;

	const isZoom = product.name.toLowerCase().includes("zoom");
	const isInPerson = product.name.toLowerCase().includes("in person");
	const type = isZoom ? "Zoom" : isInPerson ? "In Person" : "";

	return (
		<>
			<Card borderRadius="md" overflow="hidden" boxShadow="md" maxW="100%" height="100%" position="relative">
				{/* Price Tag - Positioned in top-right corner */}
				{product.price && (
					<Tag
						position="absolute"
						top="0"
						right="0"
						bg="brand.500"
						color="white"
						fontWeight="bold"
						fontSize="sm"
						py={1}
						px={3}
						borderTopRightRadius="md"
						borderBottomLeftRadius="md"
						borderTopLeftRadius="0"
						borderBottomRightRadius="0"
						boxShadow="sm">
						${product.price}
					</Tag>
				)}

				<VStack spacing={0} align="stretch" height="100%">
					<CardHeader pb={2} pt={4} pr={16}>
						{" "}
						{/* Add right padding to avoid overlap with price tag */}
						<Heading size="md" fontSize="lg" lineHeight="1.2">
							{product.name}
						</Heading>
					</CardHeader>

					<CardBody py={2}>
						<Flex direction="column" height="100%">
							<HStack mb={2} spacing={2} flexWrap="wrap">
								{duration && (
									<Badge colorScheme={isZoom ? "blue" : "green"} fontSize="md" px={2} py={1}>
										{duration} min
									</Badge>
								)}
								{type && (
									<Badge colorScheme={isZoom ? "blue" : "green"} fontSize="md" px={2} py={1}>
										{type}
									</Badge>
								)}
							</HStack>

							<Text fontSize="sm" noOfLines={4} overflow="hidden" textOverflow="ellipsis" mb={2}>
								{product.description || ""}
							</Text>

							<Button size="xs" variant="link" colorScheme="blue" onClick={onOpen} alignSelf="flex-start" mt="auto">
								More info
							</Button>
						</Flex>
					</CardBody>

					<CardFooter pt={2} pb={3} mt="auto">
						<Center w="100%">
							<BookNowButton productId={product.id} />
						</Center>
					</CardFooter>
				</VStack>
			</Card>

			{/* Modal for full description */}
			<Modal isOpen={isOpen} onClose={onClose} size="md">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						<Flex justifyContent="space-between" alignItems="center">
							<Text>{product.name}</Text>
							{product.price && (
								<Tag size="lg" colorScheme="brand" variant="solid" fontSize="xl" py={1} px={3}>
									${product.price}
								</Tag>
							)}
						</Flex>
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<Text>{product.description || "No description available."}</Text>
						<Flex mt={4} justifyContent="space-between" alignItems="center">
							{duration && (
								<Badge colorScheme={isZoom ? "blue" : "green"} px={2} py={1}>
									{duration} min
								</Badge>
							)}
							{type && (
								<Badge colorScheme={isZoom ? "blue" : "green"} px={2} py={1}>
									{type}
								</Badge>
							)}
						</Flex>
						<Center mt={6} w="100%">
							<BookNowButton productId={product.id} />
						</Center>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ProductItem;

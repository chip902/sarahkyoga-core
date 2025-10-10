// ProductItem.tsx
import { useState } from "react";
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
	Radio,
	RadioGroup,
	Stack,
	Box,
} from "@chakra-ui/react";
import { BookNowButton } from "./BookNow";

interface ProductVariant {
	id: string;
	name: string;
	price: number;
	quantity: number;
}

export interface ProductItemProps {
	product: {
		name: string;
		description: string | null;
		id: string;
		price: number;
		type?: string;
		variants?: ProductVariant[];
	};
	quantity: number;
	key: string;
}

const ProductItem = ({ product }: ProductItemProps) => {
	// Modal control
	const { isOpen, onOpen, onClose } = useDisclosure();

	// Variant selection state
	const hasVariants = product.variants && product.variants.length > 0;
	const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
		hasVariants ? product.variants?.[0]?.id : undefined
	);

	// Get the selected variant or use product price as default
	const selectedVariant = hasVariants
		? product.variants?.find(v => v.id === selectedVariantId)
		: null;
	const displayPrice = selectedVariant ? selectedVariant.price : product.price;

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
				{(displayPrice > 0 || product.price > 0) && (
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
						{hasVariants && selectedVariant
							? `$${selectedVariant.price}`
							: `$${product.price}`}
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

							{/* Variant Selection for Class Passes */}
							{hasVariants && (
								<Box mt={3} mb={2}>
									<Text fontSize="sm" fontWeight="semibold" mb={2}>
										Select Package:
									</Text>
									<RadioGroup onChange={setSelectedVariantId} value={selectedVariantId}>
										<Stack spacing={2}>
											{product.variants?.map((variant) => (
												<Radio key={variant.id} value={variant.id} size="sm">
													<Text fontSize="sm">
														{variant.name} - ${variant.price}
													</Text>
												</Radio>
											))}
										</Stack>
									</RadioGroup>
								</Box>
							)}

							<Button size="xs" variant="link" colorScheme="blue" onClick={onOpen} alignSelf="flex-start" mt="auto">
								More info
							</Button>
						</Flex>
					</CardBody>

					<CardFooter pt={2} pb={3} mt="auto">
						<Center w="100%">
							<BookNowButton
								productId={product.id}
								variantId={selectedVariantId}
							/>
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
							{(displayPrice > 0 || product.price > 0) && (
								<Tag size="lg" colorScheme="brand" variant="solid" fontSize="xl" py={1} px={3}>
									{hasVariants && selectedVariant
										? `$${selectedVariant.price}`
										: `$${product.price}`}
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

						{/* Variant Selection in Modal */}
						{hasVariants && (
							<Box mt={4}>
								<Text fontWeight="semibold" mb={2}>
									Select Package:
								</Text>
								<RadioGroup onChange={setSelectedVariantId} value={selectedVariantId}>
									<Stack spacing={2}>
										{product.variants?.map((variant) => (
											<Radio key={variant.id} value={variant.id}>
												<Flex justifyContent="space-between" w="100%">
													<Text>{variant.name}</Text>
													<Text fontWeight="bold" ml={4}>
														${variant.price}
													</Text>
												</Flex>
											</Radio>
										))}
									</Stack>
								</RadioGroup>
							</Box>
						)}

						<Center mt={6} w="100%">
							<BookNowButton
								productId={product.id}
								variantId={selectedVariantId}
							/>
						</Center>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ProductItem;

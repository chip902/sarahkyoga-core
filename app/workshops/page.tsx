"use client";
import { Heading, Text, Divider, Stack, Flex, Card, CardBody, Badge, VStack, HStack, Button } from "@chakra-ui/react";
import { useAddToCart } from "@/app/hooks/useAddToCart";
import { useProducts } from "@/app/hooks/useProducts";

const WORKSHOP_PRODUCT_NAME = "Mind The Gap: Finding Your Rib-Pelvis Stack";

export default function Workshops() {
	const { data: products = [] } = useProducts();
	const workshopProduct = products.find((product) => product.name === WORKSHOP_PRODUCT_NAME);
	const { addToCart, isLoading: isAddingToCart } = useAddToCart(workshopProduct?.id ?? "");

	const handleAddToCart = () => {
		if (!workshopProduct || isAddingToCart) return;
		addToCart();
	};

	const workshops = [
		{
			title: WORKSHOP_PRODUCT_NAME,
			type: "Workshop",
			duration: "90 minutes (10:00 AM \u2013 11:30 AM)",
			level: "All Levels",
			price: "$50",
			date: "Sunday April 19",
			location: "The Studio",
			description:
				'In this 90-minute workshop Sarah & Melissa will explore the concept of "the stack"- the dynamic relationship between the rib cage and pelvis. Participants will learn how alignment between these two structures influences breathing, core engagement, posture, and performance.',
			highlights: ["Guided movement", "Breath work", "Simple alignment assessments"],
			details:
				"We'll break down what an optimal stack looks and feels like, why many people lose it in daily life and training, and how that impacts stability and force transfer. Through guided movement, breath work, and simple assessments, you'll develop awareness of your own patterns and learn practical strategies to restore alignment. The session will also introduce ways to appropriately challenge the stack, helping you build resilience and control under load. Suitable for all levels, this workshop is ideal for anyone looking to move better, train smarter, and understand their body more deeply.",
			featured: true,
		},
	];

	return (
		<Flex
			direction="column"
			align="center"
			marginTop={["20vh", "20vh", "20vh", "20vh"]}
			paddingX={["4", "8", "16", "24"]}
			paddingY="8"
			width="100%"
			minHeight="100vh">
			{/* Workshops */}
			<Stack direction={["column", "column", "column", "row"]} spacing={6} width={["95%", "90%", "85%", "80%"]} align="stretch">
				{workshops.map((workshop, index) => (
					<Card
						key={index}
						bg="rgba(255, 255, 255, 0.9)"
						boxShadow="xl"
						borderRadius="lg"
						border={workshop.featured ? "3px solid" : undefined}
						borderColor={workshop.featured ? "brand.100" : undefined}
						flex="1"
						transition="transform 0.2s, box-shadow 0.2s"
						_hover={{
							transform: "translateY(-4px)",
							boxShadow: "2xl",
						}}>
						<CardBody padding="6">
							<VStack align="stretch" spacing={4} height="100%">
								<VStack align="start" spacing={2}>
									<Heading size="lg" color="brand.600">
										{workshop.title}
									</Heading>
									<VStack align="start" spacing={1}>
										<HStack spacing={2} wrap="wrap">
											<Badge colorScheme="gray" fontSize="xs">
												{workshop.type}
											</Badge>
											<Text fontSize="sm" color="gray.600">
												{workshop.duration} • {workshop.level}
											</Text>
										</HStack>
										<Text fontWeight="medium" color="brand.600" fontSize="sm">
											{workshop.date}
										</Text>
										<Text color="gray.500" fontSize="xs">
											{workshop.location}
										</Text>
									</VStack>
								</VStack>

								<Text fontSize="md" color="gray.700" flex="1">
									{workshop.description}
								</Text>

								<HStack justify="space-between" align="center" pt="2">
									<Text fontSize="xl" fontWeight="bold" color="brand.600">
										{workshop.price}
									</Text>
									<Button variant="cta" size="sm" onClick={handleAddToCart} isDisabled={!workshopProduct || isAddingToCart}>
										{isAddingToCart ? "Adding..." : "Add to cart"}
									</Button>
								</HStack>
								{!workshopProduct && (
									<Text fontSize="xs" color="red.500">
										Workshop product is not available yet.
									</Text>
								)}
							</VStack>
						</CardBody>
					</Card>
				))}
			</Stack>

			<Divider my={10} width={["95%", "90%", "85%", "80%"]} />
		</Flex>
	);
}

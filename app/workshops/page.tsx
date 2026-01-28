"use client";
import { Box, Heading, Text, Divider, Stack, Flex, Button, Card, CardBody, Badge, VStack, HStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { useAddToCart } from "@/app/hooks/useAddToCart";

const EXTENDED_PRACTICE_PRODUCT_ID = "be136787-fb03-407d-af05-094a0df6e1f7";

export default function Workshops() {
	const { addToCart: addExtendedPracticeToCart, isLoading: isAddingExtendedPractice } = useAddToCart(EXTENDED_PRACTICE_PRODUCT_ID);

	const workshops = [
		{
			title: "Journey to All Levels / Beginner Series Part 2",
			type: "Series",
			duration: "Four-week series • Saturdays 12:30–2:00pm",
			level: "All Levels / Advanced Beginner",
			price: "$150 series / $50 drop-in",
			date: "March series at Yoga on York",
			location: "Yoga on York",
			description:
				"This four-week Journey to All Levels series is designed to break down more intermediate poses, including backbends, twists, hip openers and building stamina.",
			highlights: ["Week 1: Twists", "Week 2: Shoulders & Sidebends", "Week 3: Backbends", "Week 4: Hips"],
			details:
				"This series is a continuation of the Beginner Series and is appropriate for students who have their foundational poses down and want to build toward an all-levels practice.",
			link: "https://www.yogaonyork.com/workshops-events",
			featured: true,
		},
		{
			title: "Katonah Yoga® Extended Practice",
			type: "Workshop",
			duration: "2 Hours (10:30am–12:30pm)",
			level: "All Levels",
			price: "$45",
			date: "Saturday March 1",
			location: "The Studio",
			description:
				"Katonah Yoga® is a rich theory developed by Nevine Michaan and her teachers. It incorporates Hatha yoga, Taoist theory and sacred geometry. We use metaphor, props and hands-on adjustments to not only explore the shapes we look to embody through asana, but to recognize habits, patterns and blind spots that we all have.",
			highlights: ["Body as a house metaphor and practice", "Physical practice, lecture and pranayama", "Magic Square orientation techniques"],
			details:
				"For this extended practice, Sarah will introduce how we use the metaphor of the body as a house and how we use practice to clean it up and organize it. Katonah Yoga is organized around three principles of esoteric dialogue: all polarities are mediated by trinity; the universe has pattern, pattern belies intelligence; by virtue of repetition there is potential for insight.",
			link: "#",
			featured: false,
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
									{workshop.featured ? (
										<Badge colorScheme="red" fontSize="xs">
											FEATURED
										</Badge>
									) : null}
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

								<Box>
									<Text fontSize="sm" fontWeight="semibold" color="brand.600" mb={2}>
										Highlights:
									</Text>
									<VStack align="start" spacing={1}>
										{workshop.highlights.slice(0, 2).map((highlight, i) => (
											<HStack key={i} align="start">
												<Box width="4px" height="4px" borderRadius="full" bg="brand.100" mt="1.5" flexShrink={0} />
												<Text fontSize="sm" color="gray.600">
													{highlight}
												</Text>
											</HStack>
										))}
									</VStack>
								</Box>

								<HStack justify="space-between" align="center" pt="2">
									<Text fontSize="xl" fontWeight="bold" color="brand.600">
										{workshop.price}
									</Text>
									{workshop.title === "Katonah Yoga® Extended Practice" ? (
										<Button
											variant="cta"
											size="sm"
											onClick={() => {
												if (isAddingExtendedPractice) return;
												addExtendedPracticeToCart();
											}}
											isDisabled={isAddingExtendedPractice}>
											{isAddingExtendedPractice ? "Adding..." : "Add to cart"}
										</Button>
									) : (
										<Button
											variant="cta"
											size="sm"
											as={NextLink}
											href={workshop.link}
											target={workshop.link.startsWith("http") ? "_blank" : undefined}>
											Register
										</Button>
									)}
								</HStack>
							</VStack>
						</CardBody>
					</Card>
				))}
			</Stack>

			<Divider my={10} width={["95%", "90%", "85%", "80%"]} />
		</Flex>
	);
}

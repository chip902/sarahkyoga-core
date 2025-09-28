"use client";
import { Box, Heading, Text, Divider, Stack, Flex, Button, Center, Card, CardBody, Badge, VStack, HStack, Icon } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";

export default function Workshops() {
	const router = useRouter();
	const handleBooking = () => {
		router.push("/booking");
	};

	const workshops = [
		{
			title: "Katonah Yoga® Extended Practice and Theory",
			type: "Workshop",
			duration: "5 Hours (11a-4p)",
			level: "All Levels",
			price: "$125",
			date: "Saturday November 8",
			location: "Prasada Yoga Center, North Hampton, NH",
			description:
				"Katonah Yoga® is a rich theory developed by Nevine Michaan and her teachers. It incorporates Hatha yoga, Taoist theory and sacred geometry. We use metaphor, props and hands on adjustments to not only explore the shapes we look to embody through asana, but to recognize habits, patterns and blind spots that we all have. We use maps like the Magic Square to orient so that we can strive to find center and circumference and how mediating polarities gives us an opportunity to have a personal insight.",
			highlights: [
				"Body as a house metaphor and practice",
				"Physical practice, lecture and pranayama",
				"Magic Square orientation techniques",
				"5hrs towards Katonah Yoga® Certification",
			],
			details:
				"For this workshop, Sarah will introduce you to how we use the metaphor of a body as a house and how we use our practice to clean it up and organize it. Katonah Yoga is organized around three principles of esoteric dialogue: all polarities are mediated by trinity; the universe has pattern, pattern belies intelligence; by virtue of repetition there is potential for insight.",
			link: "https://prasadayogacenter.com/",
			featured: true,
		},
		{
			title: "The Art of Sequencing",
			type: "Teacher Training Workshop",
			duration: "2.5 Hours (12:30-3p)",
			level: "Teachers & Students",
			price: "$75",
			date: "Saturday November 15",
			location: "Yoga on York, York ME",
			description:
				"Sequencing a yoga class is like creating a story. Intelligent storytelling allows the practitioner to move with consciousness and flow, best preparing them for the peak pose. In this workshop, we will dive into the wonderful yet sometimes complex world of sequencing a yoga class.",
			highlights: [
				"Transitions and time management",
				"Anatomy and sun salutation variations",
				"Peak pose preparation techniques",
				"2.5 hours of CE with Yoga Alliance",
			],
			details:
				"We will address transitions, time management, anatomy and using sun salutation variations towards working into a peak pose. Whether you are a new teacher just starting to craft your flows, or a seasoned teacher that has found yourself in a funk, we will collaborate using tools, techniques and community to create a safe and fun practice for all levels.",
			link: "https://www.yogaonyork.com/workshops-events",
			featured: false,
		},
		{
			title: "The Art of Adjustments",
			type: "Teacher Training Workshop",
			duration: "2.5 Hours (12:30-3p)",
			level: "Teachers & Students",
			price: "$75",
			date: "Saturday December 13",
			location: "TBD",
			description:
				"Providing adjustments in class is a powerful tool for teachers to use in public and private settings to better connect students with their bodies and the material. Before you make contact, it is important to understand both anatomy, the asana and the potency of supporting another body.",
			highlights: [
				"Safe and accessible adjustment techniques",
				"Verbal assists and prop usage",
				"Anatomy and asana understanding",
				"2.5 hours of CE with Yoga Alliance",
			],
			details:
				"In this workshop, we will practice safe and accessible adjustment for commonly practiced asana, using verbal assists and how to use props as a helpful adjusting tool.",
			link: "https://www.yogaonyork.com/workshops-events",
			featured: false,
		},
	];

	return (
		<Flex
			direction="column"
			align="center"
			marginTop={["5vh", "5vh", "15vh", "15vh"]}
			paddingX={["4", "8", "16", "24"]}
			paddingY="8"
			width="100%"
			minHeight="100vh">
			{/* Hero Section */}
			<Box
				width={["95%", "90%", "85%", "80%"]}
				bg="rgba(255, 255, 255, 0.95)"
				boxShadow="2xl"
				borderRadius="lg"
				padding={["6", "8", "10", "12"]}
				marginBottom="8"
				textAlign="center">
				<VStack spacing={4}>
					<Badge colorScheme="orange" fontSize="md" px="4" py="1" borderRadius="full">
						Special Workshops
					</Badge>
					<Heading size="2xl" color="brand.600" fontWeight="bold">
						Deepen Your Practice
					</Heading>
					<Text fontSize="lg" color="gray.600" maxWidth="600px">
						Join Sarah for transformative workshops designed to expand your yoga journey. Each session offers focused learning, personalized
						attention, and community connection.
					</Text>
				</VStack>
			</Box>

			{/* Featured Workshop */}
			{workshops
				.filter((workshop) => workshop.featured)
				.map((workshop, index) => (
					<Card
						key={index}
						width={["95%", "90%", "85%", "80%"]}
						bg="rgba(255, 255, 255, 0.95)"
						boxShadow="2xl"
						borderRadius="lg"
						marginBottom="8"
						border="3px solid"
						borderColor="brand.100"
						overflow="hidden">
						<CardBody padding={["6", "8", "10"]}>
							<VStack align="stretch" spacing={6}>
								<HStack justify="space-between" align="start" wrap="wrap">
									<VStack align="start" spacing={2} flex="1">
										<Badge colorScheme="red" fontSize="sm" px="3" py="1">
											FEATURED
										</Badge>
										<Heading size="xl" color="brand.600">
											{workshop.title}
										</Heading>
										<VStack align="start" spacing={1}>
											<HStack spacing={4} wrap="wrap">
												<Text fontWeight="semibold" color="brand.400">
													{workshop.type}
												</Text>
												<Text color="gray.600">• {workshop.duration}</Text>
												<Text color="gray.600">• {workshop.level}</Text>
											</HStack>
											<Text fontWeight="medium" color="brand.600" fontSize="md">
												{workshop.date}
											</Text>
											<Text color="gray.600" fontSize="sm">
												{workshop.location}
											</Text>
										</VStack>
									</VStack>
									<VStack align="end" spacing={2}>
										<Text fontSize="3xl" fontWeight="bold" color="brand.600">
											{workshop.price}
										</Text>
										<Button 
											variant="cta" 
											size="lg" 
											as={NextLink} 
											href={workshop.link}
											target={workshop.link.startsWith('http') ? "_blank" : undefined}
										>
											Reserve Spot
										</Button>
									</VStack>
								</HStack>

								<Text fontSize="lg" lineHeight="tall" color="gray.700">
									{workshop.description}
								</Text>

								{workshop.details && (
									<Text fontSize="md" lineHeight="tall" color="gray.600" fontStyle="italic">
										{workshop.details}
									</Text>
								)}

								<Box>
									<Heading size="md" color="brand.600" mb={3}>
										What You&apos;ll Experience:
									</Heading>
									<Stack direction={["column", "column", "row"]} spacing={4}>
										{workshop.highlights.map((highlight, i) => (
											<HStack key={i} align="start" flex="1">
												<Box width="6px" height="6px" borderRadius="full" bg="brand.100" mt="2" flexShrink={0} />
												<Text fontSize="md" color="gray.600">
													{highlight}
												</Text>
											</HStack>
										))}
									</Stack>
								</Box>
							</VStack>
						</CardBody>
					</Card>
				))}

			{/* Other Workshops */}
			<Stack direction={["column", "column", "column", "row"]} spacing={6} width={["95%", "90%", "85%", "80%"]} align="stretch">
				{workshops
					.filter((workshop) => !workshop.featured)
					.map((workshop, index) => (
						<Card
							key={index}
							bg="rgba(255, 255, 255, 0.9)"
							boxShadow="xl"
							borderRadius="lg"
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
										<Button 
											variant="cta" 
											size="sm" 
											as={NextLink} 
											href={workshop.link}
											target={workshop.link.startsWith('http') ? "_blank" : undefined}
										>
											Register
										</Button>
									</HStack>
								</VStack>
							</CardBody>
						</Card>
					))}
			</Stack>

			<Divider my={10} width={["95%", "90%", "85%", "80%"]} />

			{/* Call to Action Section */}
			<Box
				width={["95%", "90%", "75%", "60%"]}
				bg="rgba(255, 255, 255, 0.9)"
				boxShadow="xl"
				borderRadius="lg"
				padding={["6", "8"]}
				marginBottom="100px"
				textAlign="center">
				<VStack spacing={4}>
					<Heading size="lg" color="brand.600">
						Ready to Deepen Your Practice?
					</Heading>
					<Text color="gray.600" maxWidth="500px">
						Have questions about which workshop is right for you? Want to book a private session or learn about upcoming workshops?
					</Text>
					<Button variant="cta" size="lg" as={NextLink} href="https://www.yogaonyork.com/workshops-events" target="_blank">
						Sign Up for The Art of Sequencing
					</Button>
				</VStack>
			</Box>
		</Flex>
	);
}

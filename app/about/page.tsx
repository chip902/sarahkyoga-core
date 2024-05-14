import { Text, Box, Container, Flex, Heading } from "@chakra-ui/react";
import React from "react";

const AboutPage = () => {
	return (
		<Box position="relative" minH="100vh" p={4}>
			<Flex
				position="absolute"
				top="40%"
				left="50%"
				transform="translate(-50%, -50%)"
				bg="rgba(255, 255, 255, 0.7)"
				boxShadow="xl"
				borderRadius="md"
				p={8}
				maxW="800px"
				w="100%">
				<Container>
					<Heading as="h1" size="lg" mb={4}>
						ABOUT SARAH
					</Heading>
					<Text fontSize="lg" mb={4}>
						Sarah found yoga while training for her first marathon. She looked to yoga as just another part of her training regimen and after her
						first class, she realized that it would become much more. Yoga changed the way Sarah breathed, looked at herself as well as the world.
						After diving into the practice, she discovered she wanted to share this gift with others.
					</Text>
					<Text fontSize="lg" mb={4}>
						A native New Yorker, Sarah received her RYT 200 certification from Laughing Lotus Yoga Center under the tutelage of Mary Dana Abbot. In
						2021, Sarah completed her Katonah Yoga® certification. Sarah weaves both Katonah Yoga® material along with Vinyasa into her classes.
					</Text>
					<Text fontSize="lg" mb={4}>
						When Sarah is not on the mat, you can find her jogging around the New Hampshire/Maine Seacoast, baking pies or on the beach with her
						husband Steve, son Axel and daughter Lucy.
					</Text>
				</Container>
			</Flex>
		</Box>
	);
};

export default AboutPage;

import { Box, Heading, Text, Divider, Stack, Flex } from "@chakra-ui/react";

export default function YogaClasses() {
	return (
		<Flex
			position="absolute"
			top="calc(50% + 250px)"
			left="50%"
			transform="translate(-50%, -50%)"
			bg="rgba(255, 255, 255, 0.7)"
			boxShadow="xl"
			borderRadius="md"
			p={8}
			maxW="800px"
			w="100%"
			flexDirection="column"
			mb={12}>
			<Stack spacing={10}>
				{/* Sunday Class */}
				<Box>
					<Heading size="md" color="brand.600">
						Sunday: ZOOM Home Studio
					</Heading>
					<Text fontWeight="bold">Interactive Yoga Practice 8:30a-9:30a</Text>
					<Text mt={2}>
						For this 60-minute practice, expect to get a blend of workshop and flow. You can anticipate multiple movement modalities including
						vinyasa, functional mobility, and Katonah Yoga®️. While this class is geared towards students with a well-developed practice, this
						interactive practice is welcome to all students who are looking for a more integrated approach to asana practice.
					</Text>
				</Box>

				<Divider />

				{/* Tuesday Class */}
				<Box>
					<Heading size="md" color="brand.600">
						Tuesday: Prasada Yoga Center
					</Heading>
					<Text fontWeight="bold">Restorative + Sound 11a-12p</Text>
					<Text mt={2}>
						A passive props-based practice to help students relax in poses like forward folds, gentle twists, and supported back-bends. Poses are
						usually held for time to help students unwind and relax. Sarah will play the harmonium to enhance relaxation throughout the body,
						release stress, and restore your energy.
					</Text>
				</Box>

				<Divider />

				{/* Wednesday Classes */}
				<Box>
					<Heading size="md" color="brand.600">
						Wednesday: Yoga on York
					</Heading>
					<Text fontWeight="bold">All Levels 9:30a-10:45a</Text>
					<Text mt={2}>This class is both vigorous and calming. Breathing deeply, moving mindfully at your pace and level.</Text>

					<Text fontWeight="bold" mt={4}>
						Level 1 11a-12p
					</Text>
					<Text mt={2}>
						At a gentle pace, Level 1 classes provide clear instruction on the proper alignment of foundational yoga postures and breathing. No two
						classes are exactly the same, allowing you to experience and practice a variety of basic yoga poses that build strength, increase
						flexibility, improve posture, and decrease stress. For beginners who can get up and down from the floor with ease, and also great for
						experienced students who desire a gentle pace.
					</Text>
				</Box>

				<Divider />

				{/* Friday Class */}
				<Box>
					<Heading size="md" color="brand.600">
						Friday: Prasada Yoga Center
					</Heading>
					<Text fontWeight="bold">Katonah Yoga®️ 5:30p-6:45p</Text>
					<Text mt={2}>
						Katonah Yoga®️ is a syncretic Hatha yoga practice developed by Nevine Michaan of Katonah Yoga Center over 40 years. Katonah Yoga is
						organized around three principles of esoteric dialogue: all polarities are mediated by trinity; the universe has pattern, pattern belies
						intelligence; by virtue of repetition there is potential for insight. Disciplined techniques are organized for revelation through
						revolutions.
					</Text>
				</Box>
			</Stack>
		</Flex>
	);
}

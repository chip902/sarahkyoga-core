import { Box, Heading, Text, Divider, Stack, Flex, Button } from "@chakra-ui/react";
import NextLink from "next/link";

export default function YogaClasses() {
	return (
		<Flex
			justify="center"
			align="center"
			marginTop={["10vh", "10vh", "25vh", "25vh"]}
			paddingX={["4", "8", "16", "24"]}
			paddingY="8"
			width={["95%", "90%", "75%", "60%"]}
			height="auto"
			bg="rgba(255, 255, 255, 0.7)"
			boxShadow="2xl"
			borderRadius="md"
			marginBottom="100px"
			mx="auto" // This forces horizontal centering
		>
			<Box w="100%" padding={["4", "6", "8"]}>
				<Stack spacing={10}>
					{/* Sunday Class */}
					<Box>
						<Heading size="md" color="brand.600">
							Sunday
						</Heading>
						<NextLink href="/booking" passHref legacyBehavior>
							<Text as="a" height="100%" lineHeight="1.2" backgroundColor="transparent" flex={1} variant="inline">
								ZOOM Home Studio
							</Text>
						</NextLink>
						<Text fontWeight="bold">Interactive Yoga Practice 8:30a-9:30a</Text>
						<Text mt={2}>
							For this 60-minute practice, expect to get a blend of workshop and flow. You can anticipate multiple movement modalities including
							vinyasa, functional mobility, and Katonah Yoga®️. While this class is geared towards students with a well-developed practice, this
							interactive practice is welcome to all students who are looking for a more integrated approach to asana practice.
						</Text>
					</Box>

					<Divider />

					{/* Tuesday Class https://prasadayogacenter.com/ */}
					<Box>
						<Heading size="md" color="brand.600">
							Tuesday
						</Heading>
						<NextLink href="https://prasadayogacenter.com/" passHref legacyBehavior>
							<Text target="_blank" as="a" height="100%" lineHeight="1.2" backgroundColor="transparent" flex={1} variant="inline">
								Prasada Yoga Center
							</Text>
						</NextLink>
						<Text fontWeight="bold">Restorative + Sound 11a-12p</Text>
						<Text mt={2}>
							A passive props-based practice to help students relax in poses like forward folds, gentle twists, and supported back-bends. Poses
							are usually held for time to help students unwind and relax. Sarah will play the harmonium to enhance relaxation throughout the
							body, release stress, and restore your energy.
						</Text>
					</Box>

					<Divider />

					{/* Wednesday Classes https://www.yogaonyork.com/*/}
					<Box>
						<Heading size="md" color="brand.600">
							Wednesday
						</Heading>
						<NextLink href="https://yogaonyork.com/" passHref legacyBehavior>
							<Text target="_blank" as="a" height="100%" lineHeight="1.2" backgroundColor="transparent" flex={1} variant="inline">
								Yoga on York
							</Text>
						</NextLink>
						<Text fontWeight="bold">All Levels 9:30a-10:45a</Text>
						<Text mt={2}>This class is both vigorous and calming. Breathing deeply, moving mindfully at your pace and level.</Text>

						<Text fontWeight="bold" mt={4}>
							Level 1 11a-12p
						</Text>
						<Text mt={2}>
							At a gentle pace, Level 1 classes provide clear instruction on the proper alignment of foundational yoga postures and breathing. No
							two classes are exactly the same, allowing you to experience and practice a variety of basic yoga poses that build strength,
							increase flexibility, improve posture, and decrease stress. For beginners who can get up and down from the floor with ease, and also
							great for experienced students who desire a gentle pace.
						</Text>
					</Box>

					<Divider />

					{/* Friday Class */}
					<Box>
						<Heading size="md" color="brand.600">
							Friday
						</Heading>
						<NextLink href="https://prasadayogacenter.com/" passHref legacyBehavior>
							<Text target="_blank" as="a" height="100%" lineHeight="1.2" backgroundColor="transparent" flex={1} variant="inline">
								Prasada Yoga Center
							</Text>
						</NextLink>
						<Text fontWeight="bold">Katonah Yoga®️ 5:30p-6:45p</Text>
						<Text mt={2}>
							Katonah Yoga®️ is a syncretic Hatha yoga practice developed by Nevine Michaan of Katonah Yoga Center over 40 years. Katonah Yoga is
							organized around three principles of esoteric dialogue: all polarities are mediated by trinity; the universe has pattern, pattern
							belies intelligence; by virtue of repetition there is potential for insight. Disciplined techniques are organized for revelation
							through revolutions.
						</Text>
					</Box>
				</Stack>
			</Box>
		</Flex>
	);
}

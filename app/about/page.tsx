"use client";
import { Box, Button, Center, Container, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { testimonials } from "./data";
import NextLink from "next/link";

const AboutPage = () => {
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
	};

	return (
		<>
			<Box position="relative" my="50vh">
				<Flex
					position="absolute"
					top="50%"
					left="50%"
					transform="translate(-50%, -50%)"
					bg="rgba(255, 255, 255, 0.7)"
					boxShadow="xl"
					borderRadius="md"
					p={8}
					maxW="800px"
					w="100%">
					<Container>
						<Heading as="h1" fontSize="3xl" mb={4}>
							ABOUT SARAH
						</Heading>
						<Text fontSize="lg" mb={4}>
							Sarah found yoga while training for her first marathon. She looked to yoga as just another part of her training regimen and after
							her first class, she realized that it would become much more. Yoga changed the way Sarah breathed, looked at herself as well as the
							world. After diving into the practice, she discovered she wanted to share this gift with others.
						</Text>
						<Text fontSize="lg" mb={4}>
							A native New Yorker, Sarah received her RYT 200 certification from Laughing Lotus Yoga Center under the tutelage of Mary Dana Abbot.
							In 2021, Sarah completed her Katonah Yoga® certification. Sarah weaves both Katonah Yoga® material along with Vinyasa into her
							classes.
						</Text>
						<Text fontSize="lg" mb={4}>
							When Sarah is not on the mat, you can find her jogging around the New Hampshire/Maine Seacoast, baking pies or on the beach with her
							husband Steve, son Axel and daughter Lucy.
						</Text>
					</Container>
				</Flex>
			</Box>
			<Center>
				<Box mt="30vh" p={4} maxW="80vw">
					<Heading as="h1" fontSize="3xl" mb={4}>
						Testimonials
					</Heading>
					<Slider {...settings}>
						{testimonials.map((testimonial) => (
							<Box key={testimonial.id} p={4} bg="rgba(255, 255, 255, 0.7)" boxShadow="md" borderRadius="md">
								<Text>{testimonial.description}</Text>
								<Text fontWeight="bold" mt={2}>
									- {testimonial.name}
								</Text>
							</Box>
						))}
					</Slider>
				</Box>
			</Center>
			<Center>
				<Flex bg="rgba(255, 255, 255, 0.7)" boxShadow="xl" borderRadius="md" mt="10vh" maxW="800px" w="100%">
					<Container>
						<Heading as="h1" fontSize="3xl" mb={4}>
							TEACHING STYLE
						</Heading>
						<Heading as="h2" fontSize="2xl">
							KATONAH YOGA®
						</Heading>
						<Text fontSize="lg" mb={4}>
							Katonah Yoga® is a syncretic Hatha yoga practice developed by Nevine Michaan over 40 years. She and her teachers incoporate
							classical Hatha yoga with Taoist theory, geometry, magic, mythology, metaphor, and imagination — in a practical framework designed
							to potentiate personal and communal well-being. Framing the practice, maps of time and personal space are defined and refined.
							Themes using asana as origami, manipulating form for function, and developing a sense of personal measure are incorporated in
							Katonah Yoga ® practices.
						</Text>
						<Text fontSize="lg" mb={4}>
							Katonah Yoga® is organized around three principles of esoteric dialogue: all polarities are mediated by trinity; the universe has
							pattern, pattern belies intelligence; by virtue of repetition there is potential for insight. Disciplined techniques are organized
							for revelation through revolutions.
						</Text>
						<Text fontWeight="semibold">
							Katonah Yoga Center
							<br />
							39 Main Street
							<br />
							Bedford Hills, NY 10517
						</Text>
						<NextLink href="/" passHref legacyBehavior target="_blank">
							<Button as="a" flex={1} variant="inline">
								www.katonahyoga.com
							</Button>
						</NextLink>
						<Heading as="h2" fontSize="2xl">
							CHAIR YOGA
						</Heading>
						<Text>
							Chair yoga is for everyone. It can be used as a physically demanding practice to access a deeper understanding of the pose. It can
							be restorative and serve to give us leverage to be held. It can also be used to turn ourselves upside down and change our
							perspective. Chair classes are inspired heavily by Katonah Yoga®
						</Text>
						<Heading as="h2" fontSize="2xl">
							VINYASA
						</Heading>
						<Text mb="7vh">
							Vinyasa yoga, also known as Flow or Vinyasa Flow, is focuses on a linking one breath per movement so that there is a tempo as we
							travel through class. Classes incorporate sun salutations, inversions, twists, folds and more.. In my Vinyasa/Flow classes, Katonah
							Yoga ® elements will be introduced and explored.
						</Text>
					</Container>
				</Flex>
			</Center>
			<Spacer my="20vh" />
		</>
	);
};

export default AboutPage;

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
		<Box px={{ base: "10vw", md: "16vw" }}>
			<Box maxW="800px" mx="auto" mt={{ base: "25vh", md: "16vh" }} mb={{ base: "6vh", md: "10vh" }}>
				<Box
					bg="rgba(255, 255, 255, 0.7)"
					boxShadow="xl"
					borderRadius="md"
					p={{ base: 8, md: 10 }} // Increased padding
					w="100%">
					<Container maxW="100%" px={{ base: 3, md: 5 }}>
						<Heading
							fontFamily="inherit"
							as="h1"
							fontSize={{ base: "2xl", md: "3xl" }}
							mb={6} // More space below heading
						>
							ABOUT SARAH
						</Heading>
						<Text
							fontSize={{ base: "md", md: "lg" }}
							mb={5} // More space between paragraphs
							lineHeight="taller" // Increased line height
						>
							Sarah found yoga while training for her first marathon. She looked to yoga as just another part of her training regimen and after
							her first class, she realized that it would become much more. Yoga changed the way Sarah breathed, looked at herself as well as the
							world. After diving into the practice, she discovered she wanted to share this gift with others.
						</Text>
					</Container>
				</Box>
			</Box>

			{/* Testimonials Section */}
			<Box maxW="800px" mx="auto" my={{ base: "12vh", md: "16vh" }}>
				<Box
					bg="rgba(255, 255, 255, 0.7)"
					boxShadow="md"
					borderRadius="md"
					p={{ base: 8, md: 10 }} // Significantly increased padding around content
					mb={{ base: 10, md: 12 }}>
					<Heading
						fontFamily="inherit"
						as="h1"
						fontSize={{ base: "2xl", md: "3xl" }}
						mb={8} // More space below heading
						px={{ base: 2, md: 4 }} // Additional padding for the heading
					>
						Testimonials
					</Heading>

					<Box
						className="testimonial-slider-container"
						pb={{ base: 14, md: 16 }} // Substantially more padding at bottom for slider controls
					>
						<Slider {...settings}>
							{testimonials.map((testimonial) => (
								<Box
									key={testimonial.id}
									p={{ base: 6, md: 8 }} // Much more padding inside testimonial boxes
									bg="rgba(255, 255, 255, 0.9)"
									boxShadow="md"
									borderRadius="md"
									mx={2} // More horizontal margin between slides
								>
									<Text
										fontSize={{ base: "md", md: "lg" }}
										lineHeight="taller" // Increased line height for better readability
										px={{ base: 3, md: 5 }} // Additional padding on text sides
									>
										{testimonial.description}
									</Text>
									<Text
										fontWeight="bold"
										mt={4}
										px={{ base: 3, md: 5 }} // Match the text padding
									>
										- {testimonial.name}
									</Text>
								</Box>
							))}
						</Slider>
					</Box>
				</Box>
			</Box>

			{/* Teaching Style Section */}
			<Box mx="auto" my={{ base: "12vh", md: "20vh" }} py="14px">
				<Box
					bg="rgba(255, 255, 255, 0.7)"
					boxShadow="xl"
					borderRadius="md"
					p={{ base: 8, md: 10 }} // Increased padding
					w="100%">
					<Container maxW="100%" px={{ base: "3", md: "5" }} py={{ base: "3", md: "5" }}>
						<Heading fontFamily="inherit" as="h1" fontSize={{ base: "2xl", md: "3xl" }} mb={10}>
							TEACHING STYLE
						</Heading>
						<Heading fontFamily="inherit" as="h2" fontSize={{ base: "xl", md: "2xl" }} my={10}>
							KATONAH YOGA®
						</Heading>
						<Text fontSize={{ base: "md", md: "lg" }} mb={5} lineHeight="taller">
							Katonah Yoga® is a syncretic Hatha yoga practice developed by Nevine Michaan over 40 years. She and her teachers incoporate
							classical Hatha yoga with Taoist theory, geometry, magic, mythology, metaphor, and imagination — in a practical framework designed
							to potentiate personal and communal well-being. Framing the practice, maps of time and personal space are defined and refined.
							Themes using asana as origami, manipulating form for function, and developing a sense of personal measure are incorporated in
							Katonah Yoga® practices.
						</Text>
						<Text fontSize={{ base: "md", md: "lg" }} mb={4}>
							Katonah Yoga® is organized around three principles of esoteric dialogue: all polarities are mediated by trinity; the universe has
							pattern, pattern belies intelligence; by virtue of repetition there is potential for insight. Disciplined techniques are organized
							for revelation through revolutions.
						</Text>
						<Text fontWeight="semibold" mb={3}>
							Katonah Yoga Center
							<br />
							39 Main Street
							<br />
							Bedford Hills, NY 10517
						</Text>
						<Box mb={6}>
							<NextLink href="https://katonahyoga.com/" target="_blank" passHref>
								<Button variant="inline">www.katonahyoga.com</Button>
							</NextLink>
						</Box>
						<Heading fontFamily="inherit" as="h2" fontSize={{ base: "xl", md: "2xl" }} my={4}>
							CHAIR YOGA
						</Heading>
						<Text fontSize={{ base: "md", md: "lg" }} mb={5}>
							Chair yoga is for everyone. It can be used as a physically demanding practice to access a deeper understanding of the pose. It can
							be restorative and serve to give us leverage to be held. It can also be used to turn ourselves upside down and change our
							perspective. Chair classes are inspired heavily by Katonah Yoga®
						</Text>
						<Heading fontFamily="inherit" as="h2" fontSize={{ base: "xl", md: "2xl" }} my={4}>
							VINYASA
						</Heading>
						<Text fontSize={{ base: "md", md: "lg" }} mb={4}>
							Vinyasa yoga, also known as Flow or Vinyasa Flow, is focuses on a linking one breath per movement so that there is a tempo as we
							travel through class. Classes incorporate sun salutations, inversions, twists, folds and more.. In my Vinyasa/Flow classes, Katonah
							Yoga ® elements will be introduced and explored.
						</Text>
					</Container>
				</Box>
			</Box>

			<Spacer my={{ base: "8vh", md: "10vh" }} />
		</Box>
	);
};

export default AboutPage;

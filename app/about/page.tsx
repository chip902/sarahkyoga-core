"use client";
import { Text, Box, Container, Flex, Heading } from "@chakra-ui/react";
import Slider from "react-slick";
import React from "react";
import { testimonials } from "./data";

const AboutPage = () => {
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 3,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
					infinite: true,
					dots: true,
				},
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
					initialSlide: 2,
				},
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	};

	return (
		<>
			<Box position="relative" minH="100vh" p={4}>
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
						<Heading as="h1" size="lg" mb={4}>
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
			<Box mt={16} p={4} maxWidth="100vw" overflow="hidden">
				<Heading as="h2" size="lg" mb={4}>
					Testimonials
				</Heading>
				<Slider {...settings}>
					{testimonials.map((testimonial) => (
						<Box key={testimonial.id} p={4} boxShadow="md" borderRadius="md" bg="white">
							<Text>{testimonial.description}</Text>
							<Text fontWeight="bold" mt={2}>
								- {testimonial.name}
							</Text>
						</Box>
					))}
				</Slider>
			</Box>
		</>
	);
};

export default AboutPage;

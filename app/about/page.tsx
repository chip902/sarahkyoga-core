"use client";
import { Box, Button, Container, Heading, Spacer, Text, VStack } from "@chakra-ui/react";
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
		// Much more aggressive padding on the main container
		<Box width="100%" overflowX="hidden" px={{ base: "20px", sm: "30px", md: "40px" }} my={{ base: 200, sm: 100, md: 50 }}>
			<Container maxW={{ base: "100%", md: "760px" }} mx="auto">
				{/* About Sarah Section */}
				<Box mt={{ base: "24", md: "32" }} mb={{ base: "16", md: "24" }}>
					<Box
						bg="rgba(255, 255, 255, 0.7)"
						boxShadow="xl"
						borderRadius="md"
						p={{ base: "16px", md: "24px" }} // Explicit pixel values
						width="100%">
						<Box px={{ base: "16px", md: "24px" }}>
							<Heading fontFamily="inherit" as="h1" fontSize={{ base: "2xl", md: "3xl" }} p={5}>
								ABOUT SARAH
							</Heading>
							<Text fontSize={{ base: "md", md: "lg" }} mb="5" lineHeight="taller" p={5}>
								Sarah found yoga while training for her first marathon. She looked to yoga as just another part of her training regimen and
								after her first class, she realized that it would become much more. Yoga changed the way Sarah breathed, looked at herself as
								well as the world. After diving into the practice, she discovered she wanted to share this gift with others.
							</Text>
						</Box>
					</Box>
				</Box>

				{/* Testimonials Section */}
				<Box
					my={{ base: "20", md: "28" }} // Larger vertical gap between sections
				>
					<Box
						bg="rgba(255, 255, 255, 0.7)"
						boxShadow="md"
						borderRadius="md"
						p={{ base: "16px", md: "24px" }} // Explicit pixel values
						width="100%">
						<Box px={{ base: "16px", md: "24px" }}>
							<Heading fontFamily="inherit" as="h1" fontSize={{ base: "2xl", md: "3xl" }} p={5}>
								Testimonials
							</Heading>
							<Box
								className="testimonial-slider-container"
								pb={{ base: "16", md: "20" }}
								mb="6"
								// Custom slider styling
								sx={{
									".slick-slide": {
										px: 4, // Add space around slides
									},
									".slick-dots": {
										bottom: "-35px",
									},
								}}>
								<Slider {...settings}>
									{testimonials.map((testimonial) => (
										<Box
											key={testimonial.id}
											p={{ base: "16px", md: "24px" }} // Explicit pixel values
											bg="rgba(255, 255, 255, 0.9)"
											boxShadow="md"
											borderRadius="md">
											<Text fontSize={{ base: "md", md: "lg" }} lineHeight="taller" p={5}>
												{testimonial.description}
											</Text>
											<Text fontWeight="bold" mt={4} mb={4} px={5}>
												- {testimonial.name}
											</Text>
										</Box>
									))}
								</Slider>
							</Box>
						</Box>
					</Box>
				</Box>

				{/* Teaching Style Section */}
				<Box
					my={{ base: "20", md: "28" }} // Larger vertical gap
				>
					<Box
						bg="rgba(255, 255, 255, 0.7)"
						boxShadow="xl"
						borderRadius="md"
						p={{ base: "16px", md: "24px" }} // Explicit pixel values
						width="100%">
						<Box px={{ base: "16px", md: "24px" }}>
							<VStack spacing="6" align="stretch">
								<Heading fontFamily="inherit" as="h1" fontSize={{ base: "2xl", md: "3xl" }} p={5}>
									TEACHING STYLE
								</Heading>

								<VStack spacing="5" align="stretch" p={4}>
									<Heading fontFamily="inherit" as="h2" fontSize={{ base: "xl", md: "2xl" }}>
										KATONAH YOGA®
									</Heading>
									<Text fontSize={{ base: "md", md: "lg" }} lineHeight="taller">
										Katonah Yoga® is a syncretic Hatha yoga practice developed by Nevine Michaan over 40 years. She and her teachers
										incoporate classical Hatha yoga with Taoist theory, geometry, magic, mythology, metaphor, and imagination — in a
										practical framework designed to potentiate personal and communal well-being.
									</Text>
									<Text fontSize={{ base: "md", md: "lg" }} lineHeight="taller">
										Katonah Yoga® is organized around three principles of esoteric dialogue: all polarities are mediated by trinity; the
										universe has pattern, pattern belies intelligence; by virtue of repetition there is potential for insight.
									</Text>
								</VStack>

								<Box p={4} mb={4}>
									<Text fontWeight="semibold" mb="3">
										Katonah Yoga Center
										<br />
										39 Main Street
										<br />
										Bedford Hills, NY 10517
									</Text>
									<NextLink href="https://katonahyoga.com/" target="_blank" passHref>
										<Button variant="inline">www.katonahyoga.com</Button>
									</NextLink>
								</Box>

								{/* Other sections with same padding approach */}
							</VStack>
						</Box>
					</Box>
				</Box>

				<Spacer my={{ base: "8", md: "10" }} />
			</Container>
		</Box>
	);
};

export default AboutPage;

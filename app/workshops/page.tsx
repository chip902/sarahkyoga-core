// /Users/andrew/code/sarahkyoga-core/app/workshops/page.tsx
"use client";
import React from "react";
import { Flex, Container, Box, Heading, Text } from "@chakra-ui/react";
import useFetchData from "../hooks/useFetchData";

interface Workshop {
	id: number;
	documentId: string;
	title: string;
	date: string;
	text: Array<{
		type: string;
		level?: number; // Only for "heading" type
		children: Array<{ text: string; type: string }>;
	}>;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
}

const Workshops = () => {
	const { data, loading, error } = useFetchData<Workshop[]>("/api/workshops");

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<Container bg="whiteAlpha.200" maxW="container.xl" my="300px">
			{!(data && data.length) ? (
				<div>No Workshops available</div>
			) : (
				data.map((workshop, index) => (
					<Box key={index} bg="white" p={6} borderRadius="lg" shadow="sm" mb="20px">
						<Heading fontFamily="inherit" as="h2" mb={4}>
							{workshop.title}
						</Heading>
						<div>
							{workshop.text.map((element, idx) => {
								if (element.type === "heading" && element.level !== undefined) {
									// Define valid heading levels
									const validHeadingLevels = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;
									type ValidHeadingLevel = (typeof validHeadingLevels)[number];
									// Ensure the level is within the valid range
									const level = Math.min(Math.max(element.level, 1), 6);
									// Assign the appropriate heading type
									const as: ValidHeadingLevel = `h${level}` as ValidHeadingLevel;
									return (
										<Heading key={idx} as={as} size={as.slice(1)} mt={4}>
											{element.children[0]?.text}
										</Heading>
									);
								} else if (element.type === "paragraph") {
									// Handle paragraph elements
									return (
										<Text key={idx} mb={2}>
											{element.children[0]?.text}
										</Text>
									);
								}
								// Handle other types of elements if needed
								return null;
							})}
						</div>
					</Box>
				))
			)}
		</Container>
	);
};

export default Workshops;

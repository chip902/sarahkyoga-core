"use client";
import React from "react";
import { Container, Box, Heading, Text, Link, Skeleton } from "@chakra-ui/react";
import useFetchData from "../hooks/useFetchData";

interface LinkFields {
	url: string;
	newTab: boolean;
	linkType: string;
}

interface RichTextChild {
	id?: string;
	type: string;
	fields?: LinkFields;
	format?: string;
	indent?: number;
	version?: number;
	children?: {
		mode: string;
		text: string;
		type: string;
		style: string;
		detail: number;
		format: number;
		version: number;
	}[];
	direction?: string;
	text?: string;
}

interface Workshop {
	id: string;
	title: string;
	recurrence: "single" | "weekly" | "range";
	startDate: string;
	endDate: string;
	dayOfWeek?: "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";
	timeRange: {
		startTime: string;
		endTime: string;
	};
	description: {
		root: {
			children: Array<{
				type: string;
				children: RichTextChild[];
			}>;
		};
	};
	location: string;
	price?: number;
	maxParticipants: number;
	isPublished: boolean;
	slug: string;
}

interface PayloadResponse {
	docs: Workshop[];
	totalDocs: number;
	limit: number;
	totalPages: number;
	page: number;
	pagingCounter: number;
	hasPrevPage: boolean;
	hasNextPage: boolean;
	prevPage: number | null;
	nextPage: number | null;
}

const formatDateRange = (startDate: string, endDate: string, recurrence: Workshop["recurrence"], dayOfWeek?: string) => {
	const start = new Date(startDate);
	const end = new Date(endDate);

	if (recurrence === "single") {
		return new Date(startDate).toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	}

	if (recurrence === "weekly") {
		return `${dayOfWeek?.charAt(0).toUpperCase()}${dayOfWeek?.slice(1)}s, ${start.toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
		})} - ${end.toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
		})}`;
	}

	return `${start.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
	})} - ${end.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	})}`;
};

const renderRichTextContent = (node: RichTextChild) => {
	if (node.type === "link" && node.fields?.url) {
		return (
			<Link href={node.fields.url} isExternal={node.fields.newTab} color="blue.500" textDecoration="underline">
				{node.children?.[0]?.text || ""}
			</Link>
		);
	}

	// For regular text nodes
	return node.text || "";
};

const Workshops = () => {
	const { data, loading, error } = useFetchData<PayloadResponse>("https://content.sarahkyoga.com/api/workshops");

	if (loading)
		return (
			<Container maxW="container.xl" my="300px">
				<Skeleton />
			</Container>
		);
	if (error) return <div>Error: {error}</div>;

	return (
		<Container bg="whiteAlpha.200" maxW="container.xl" my="300px">
			{!data?.docs.length ? (
				<div>No Workshops available</div>
			) : (
				data.docs
					.filter((workshop) => workshop.isPublished)
					.map((workshop) => (
						<Box key={workshop.id} bg="white" p={6} borderRadius="lg" shadow="sm" mb="20px">
							<Heading fontFamily="inherit" as="h2" mb={4}>
								{workshop.title}
							</Heading>

							{/* Date Range and Time */}
							<Heading fontFamily="inherit" as="h3" size="md" mb={4}>
								{formatDateRange(workshop.startDate, workshop.endDate, workshop.recurrence, workshop.dayOfWeek)}
							</Heading>
							<Text mb={4}>
								Time: {workshop.timeRange.startTime} - {workshop.timeRange.endTime}
							</Text>

							{/* Location */}
							<Text mb={4}>Location: {workshop.location}</Text>

							{/* Price and Spots */}
							<Text mb={4}>
								{workshop.price && `Price: $${workshop.price}`}
								{workshop.price && workshop.maxParticipants && <br />}
								{workshop.maxParticipants && `Available Spots: ${workshop.maxParticipants}`}
							</Text>

							{/* Rich Text Description */}
							<div>
								{workshop.description.root.children.map((block, idx) => {
									if (block.type === "paragraph") {
										return (
											<Text key={idx} mb={2}>
												{block.children.map((child, childIdx) => (
													<React.Fragment key={childIdx}>{renderRichTextContent(child)}</React.Fragment>
												))}
											</Text>
										);
									}
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

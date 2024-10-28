"use client";

import React, { useState, useEffect } from "react";
import { Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, useToast } from "@chakra-ui/react";
import TextEditor from "../text-editor/TextEditor";
import NewsletterList from "./NewsletterList";
import { TextStyle } from "../text-editor/types";

interface Newsletter {
	id: string;
	title: string;
	content: string;
	style: TextStyle;
	createdAt: Date;
	isDraft: boolean;
}

const NewsletterDashboard: React.FC = () => {
	const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
	const [editingNewsletter, setEditingNewsletter] = useState<Newsletter | null>(null);
	const toast = useToast();

	useEffect(() => {
		fetchNewsletters();
	}, []);

	const fetchNewsletters = async () => {
		try {
			const response = await fetch("/api/newsletter");
			if (!response.ok) throw new Error("Failed to fetch newsletters");
			const data = await response.json();
			setNewsletters(
				data.map((newsletter: any) => ({
					...newsletter,
					createdAt: new Date(newsletter.createdAt),
				}))
			);
		} catch (error) {
			toast({
				title: "Error fetching newsletters",
				description: error instanceof Error ? error.message : "Unknown error occurred",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
	};

	const handleSave = async (data: { subject: string; content: string; style: TextStyle; isDraft: boolean }) => {
		try {
			const response = await fetch("/api/newsletter", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: data.subject,
					content: data.content,
					style: data.style,
					isDraft: data.isDraft,
				}),
			});

			if (!response.ok) throw new Error("Failed to save newsletter");

			const savedNewsletter = await response.json();
			savedNewsletter.createdAt = new Date(savedNewsletter.createdAt);
			setNewsletters([savedNewsletter, ...newsletters]);

			toast({
				title: `Newsletter ${data.isDraft ? "saved as draft" : "published"}`,
				status: "success",
				duration: 3000,
				isClosable: true,
			});
		} catch (error) {
			toast({
				title: "Error saving newsletter",
				description: error instanceof Error ? error.message : "Unknown error occurred",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
	};

	const handleEdit = (newsletter: Newsletter) => {
		setEditingNewsletter(newsletter);
	};

	return (
		<Box>
			<Heading mb={6} color="brand.100">
				Newsletter Dashboard
			</Heading>
			<Tabs variant="enclosed">
				<TabList>
					<Tab _selected={{ color: "brand.100", bg: "white" }}>Create Newsletter</Tab>
					<Tab _selected={{ color: "brand.100", bg: "white" }}>Published</Tab>
					<Tab _selected={{ color: "brand.100", bg: "white" }}>Drafts</Tab>
				</TabList>
				<TabPanels>
					<TabPanel bg="white">
						<TextEditor
							onSave={handleSave}
							initialContent={editingNewsletter?.content}
							initialStyle={editingNewsletter?.style}
							initialSubject={editingNewsletter?.title}
							newsletterId={editingNewsletter?.id}
						/>
					</TabPanel>
					<TabPanel bg="white">
						<NewsletterList newsletters={newsletters.filter((n) => !n.isDraft)} onEdit={handleEdit} />
					</TabPanel>
					<TabPanel bg="white">
						<NewsletterList newsletters={newsletters.filter((n) => n.isDraft)} onEdit={handleEdit} />
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Box>
	);
};

export default NewsletterDashboard;

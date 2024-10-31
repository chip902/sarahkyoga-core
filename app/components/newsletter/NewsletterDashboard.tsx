"use client";

import React, { useState, useEffect } from "react";
import { Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, useToast } from "@chakra-ui/react";
import TextEditor from "../text-editor/TextEditor";
import NewsletterList from "./NewsletterList";
import { TextStyle } from "../text-editor/types";
import { DeleteConfirmDialog } from "./DeleteConfirmDialoge";

const DEFAULT_STYLE: TextStyle = {
	fontFamily: "Quicksand",
	fontSize: 16,
	isBold: false,
	isItalic: false,
	isUnderline: false,
	textAlign: "left",
	textColor: "#000000",
	backgroundColor: "#ffffff",
};

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
	const [activeTab, setActiveTab] = useState(0);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [newsletterToDelete, setNewsletterToDelete] = useState<Newsletter | null>(null);
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
					style: newsletter.style || DEFAULT_STYLE,
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
			const endpoint = editingNewsletter ? `/api/newsletter/${editingNewsletter.id}` : "/api/newsletter";
			const method = editingNewsletter ? "PATCH" : "POST";

			const response = await fetch(endpoint, {
				method,
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

			if (editingNewsletter) {
				setNewsletters(
					newsletters.map((n) => (n.id === savedNewsletter.id ? { ...savedNewsletter, createdAt: new Date(savedNewsletter.createdAt) } : n))
				);
			} else {
				setNewsletters([{ ...savedNewsletter, createdAt: new Date(savedNewsletter.createdAt) }, ...newsletters]);
			}

			setEditingNewsletter(null);
			setActiveTab(data.isDraft ? 2 : 1);

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

	const handleEdit = async (newsletter: Newsletter) => {
		try {
			const response = await fetch(`/api/newsletter/${newsletter.id}`);
			if (!response.ok) throw new Error("Failed to fetch newsletter");
			const fullNewsletter = await response.json();

			setEditingNewsletter({
				...fullNewsletter,
				createdAt: new Date(fullNewsletter.createdAt),
				style: fullNewsletter.style || DEFAULT_STYLE,
				title: fullNewsletter.title || "",
				content: fullNewsletter.content || "",
				isDraft: Boolean(fullNewsletter.isDraft),
			});

			setActiveTab(0);

			toast({
				title: "Newsletter loaded for editing",
				status: "success",
				duration: 2000,
				isClosable: true,
			});
		} catch (error) {
			toast({
				title: "Error loading newsletter",
				description: error instanceof Error ? error.message : "Unknown error occurred",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		}
	};

	const handleDelete = (newsletter: Newsletter) => {
		setNewsletterToDelete(newsletter);
		setIsDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = () => {
		fetchNewsletters();
	};

	const handleTabChange = (index: number) => {
		if (index === 0) {
			setEditingNewsletter(null);
		}
		setActiveTab(index);
	};

	return (
		<Box>
			<Heading mb={6} color="brand.100" fontFamily={"inherit"}>
				Newsletter Dashboard
			</Heading>
			<Tabs index={activeTab} onChange={handleTabChange} variant="enclosed" colorScheme="brand">
				<TabList mb={4}>
					<Tab>{editingNewsletter ? "Edit Newsletter" : "Create Newsletter"}</Tab>
					<Tab>Published</Tab>
					<Tab>Drafts</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<TextEditor
							key={editingNewsletter?.id || "new"}
							onSave={handleSave}
							initialContent={editingNewsletter?.content || ""}
							initialStyle={editingNewsletter?.style || DEFAULT_STYLE}
							initialSubject={editingNewsletter?.title || ""}
							newsletterId={editingNewsletter?.id}
						/>
					</TabPanel>
					<TabPanel>
						<NewsletterList newsletters={newsletters.filter((n) => !n.isDraft)} onEdit={handleEdit} onDelete={handleDelete} />
					</TabPanel>
					<TabPanel>
						<NewsletterList newsletters={newsletters.filter((n) => n.isDraft)} onEdit={handleEdit} onDelete={handleDelete} />
					</TabPanel>
				</TabPanels>
			</Tabs>

			{newsletterToDelete && (
				<DeleteConfirmDialog
					isOpen={isDeleteDialogOpen}
					onClose={() => {
						setIsDeleteDialogOpen(false);
						setNewsletterToDelete(null);
					}}
					newsletter={{
						id: newsletterToDelete.id,
						title: newsletterToDelete.title,
					}}
					onConfirm={handleDeleteConfirm}
				/>
			)}
		</Box>
	);
};

export default NewsletterDashboard;

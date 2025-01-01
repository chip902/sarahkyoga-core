"use client";

import { toaster } from "@/src/components/ui/toaster";
import { DialogRoot, DialogBody, DialogHeader, DialogTitle, DialogFooter, DialogContent } from "@/src/components/ui/dialog";
import { useState } from "react";
import { VStack, Text, Button, DialogCloseTrigger } from "@chakra-ui/react";

interface DeleteConfirmDialogProps {
	isOpen: boolean;
	onClose: () => void;
	newsletter: {
		id: string;
		title: string;
	};
	onConfirm: () => void;
}

export function DeleteConfirmDialog({ isOpen, onClose, newsletter, onConfirm }: DeleteConfirmDialogProps) {
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			const response = await fetch(`/api/newsletter/${newsletter.id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to delete newsletter");
			}

			toaster.create({
				title: "Newsletter deleted",
				description: "The newsletter has been permanently removed",
				type: "success",
				duration: 3000,
			});

			onConfirm();
		} catch (error) {
			toaster.create({
				title: "Error deleting newsletter",
				description: error instanceof Error ? error.message : "Unknown error occurred",
				type: "error",
				duration: 5000,
			});
		} finally {
			setIsDeleting(false);
			onClose();
		}
	};

	return (
		<DialogRoot open={isOpen} closeOnEscape>
			<DialogContent>
				<DialogTitle>Delete</DialogTitle>
				<DialogHeader>Confirm Deletion</DialogHeader>
				<DialogBody>
					<VStack gap={4} align="stretch">
						<Text>Are you sure you want to delete the newsletter &quot;{newsletter.title}&quot;?</Text>
						<Text fontSize="sm" color="gray.500">
							This action cannot be undone.
						</Text>
					</VStack>
				</DialogBody>

				<DialogFooter>
					<DialogCloseTrigger>
						<Button variant="ghost" mr={3} onClick={onClose} disabled={isDeleting}>
							Cancel
						</Button>
					</DialogCloseTrigger>
					<Button colorScheme="red" onClick={handleDelete} disabled={isDeleting}>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</DialogRoot>
	);
}

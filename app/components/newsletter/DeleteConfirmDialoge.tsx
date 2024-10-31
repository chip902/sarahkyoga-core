"use client";

import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Text, VStack, useToast } from "@chakra-ui/react";
import { useState } from "react";

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
	const toast = useToast();

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

			toast({
				title: "Newsletter deleted",
				description: "The newsletter has been permanently removed",
				status: "success",
				duration: 3000,
				isClosable: true,
			});

			onConfirm();
		} catch (error) {
			toast({
				title: "Error deleting newsletter",
				description: error instanceof Error ? error.message : "Unknown error occurred",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		} finally {
			setIsDeleting(false);
			onClose();
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Confirm Deletion</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<VStack spacing={4} align="stretch">
						<Text>Are you sure you want to delete the newsletter &quot;{newsletter.title}&quot;?</Text>
						<Text fontSize="sm" color="gray.500">
							This action cannot be undone.
						</Text>
					</VStack>
				</ModalBody>

				<ModalFooter>
					<Button variant="ghost" mr={3} onClick={onClose} isDisabled={isDeleting}>
						Cancel
					</Button>
					<Button colorScheme="red" onClick={handleDelete} isLoading={isDeleting} loadingText="Deleting...">
						Delete
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

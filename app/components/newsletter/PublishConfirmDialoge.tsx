// components/Newsletter/PublishConfirmDialog.tsx

import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Text, VStack, useToast } from "@chakra-ui/react";
import { useState } from "react";

interface PublishConfirmDialogProps {
	isOpen: boolean;
	onClose: () => void;
	newsletter: {
		id: string;
		title: string;
	};
	onConfirm: () => void;
}

export default function PublishConfirmDialog({ isOpen, onClose, newsletter, onConfirm }: PublishConfirmDialogProps) {
	const [isPublishing, setIsPublishing] = useState(false);
	const toast = useToast();

	const handlePublish = async () => {
		setIsPublishing(true);
		try {
			const response = await fetch("/api/newsletter/publish", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					newsletterId: newsletter.id,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to publish newsletter");
			}

			toast({
				title: "Newsletter published",
				description: "The newsletter has been sent to all subscribers",
				status: "success",
				duration: 5000,
				isClosable: true,
			});

			onConfirm();
		} catch (error) {
			toast({
				title: "Error publishing newsletter",
				description: error instanceof Error ? error.message : "Unknown error occurred",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
			setIsPublishing(false);
		} finally {
			setIsPublishing(false);
			onClose();
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} colorScheme="brand">
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Confirm Publication</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<VStack spacing={4} align="stretch">
						<Text>Are you sure you want to publish &quot;{newsletter.title}&quot; and send it to all subscribers?</Text>
						<Text fontSize="sm" color="gray.500">
							This action cannot be undone.
						</Text>
					</VStack>
				</ModalBody>

				<ModalFooter>
					<Button variant="ghost" mr={3} onClick={onClose}>
						Cancel
					</Button>
					<Button colorScheme="blue" onClick={handlePublish} isLoading={isPublishing}>
						Publish
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}

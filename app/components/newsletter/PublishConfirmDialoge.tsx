// components/Newsletter/PublishConfirmDialog.tsx

import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Text, VStack, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Diagnostic info type for error reporting
type DiagnosticInfo = {
	newsletterId: string;
	newsletterTitle: string;
	timestamp: string;
	errorMessage: string;
	userAgent: string;
	url: string;
};

function generateDiagnosticInfo(info: DiagnosticInfo): string {
	return `Newsletter Publish Error Report
================================
Newsletter ID: ${info.newsletterId}
Newsletter Title: ${info.newsletterTitle}
Timestamp: ${info.timestamp}
Error: ${info.errorMessage}
User Agent: ${info.userAgent}
URL: ${info.url}`;
}

function copyToClipboard(text: string) {
	navigator.clipboard.writeText(text).catch(() => {
		// Fallback for older browsers
		const textarea = document.createElement("textarea");
		textarea.value = text;
		document.body.appendChild(textarea);
		textarea.select();
		document.execCommand("copy");
		document.body.removeChild(textarea);
	});
}
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
	const router = useRouter();

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
				const errorData = await response.json().catch(() => ({ error: "Failed to publish newsletter" }));
				const errorMessage = errorData.error || errorData.message || `HTTP ${response.status}: Failed to publish newsletter`;
				throw new Error(errorMessage);
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
			const diagnosticInfo: DiagnosticInfo = {
				newsletterId: newsletter.id,
				newsletterTitle: newsletter.title,
				timestamp: new Date().toISOString(),
				errorMessage: error instanceof Error ? error.message : "Unknown error occurred",
				userAgent: navigator.userAgent,
				url: window.location.href,
			};
			const diagnosticText = generateDiagnosticInfo(diagnosticInfo);

			toast({
				title: "Error publishing newsletter",
				description: (
					<VStack align="start" spacing={2}>
						<Text>{error instanceof Error ? error.message : "Unknown error occurred"}</Text>
						<Button
							size="sm"
							colorScheme="red"
							variant="outline"
							onClick={() => {
								copyToClipboard(diagnosticText);
								toast({
									title: "Copied!",
									description: "Diagnostic info copied to clipboard. Paste it in an email to send.",
									status: "success",
									duration: 3000,
									isClosable: true,
								});
							}}>
							Copy Diagnostic Info
						</Button>
					</VStack>
				),
				status: "error",
				duration: null,
				isClosable: true,
			});
			setIsPublishing(false);
		} finally {
			setIsPublishing(false);
			router.push("/admin/newsletter");
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

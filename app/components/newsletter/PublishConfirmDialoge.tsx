// components/Newsletter/PublishConfirmDialog.tsx

import { Button, Text, VStack } from "@chakra-ui/react";
import { toaster } from "@/src/components/ui/toaster";
import { DialogRoot, DialogBody, DialogHeader, DialogTitle, DialogFooter, DialogContent } from "@/src/components/ui/dialog";
import { useRouter } from "next/navigation";
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
				throw new Error("Failed to publish newsletter");
			}

			toaster.create({
				title: "Newsletter published",
				description: "The newsletter has been sent to all subscribers",
				type: "success",
				duration: 5000,
			});

			onConfirm();
		} catch (error) {
			toaster.create({
				title: "Error publishing newsletter",
				description: error instanceof Error ? error.message : "Unknown error occurred",
				type: "error",
				duration: 5000,
			});
			setIsPublishing(false);
		} finally {
			setIsPublishing(false);
			router.push("/admin/newsletter");
			onClose();
		}
	};

	return (
		<DialogRoot open={isOpen}>
			<DialogContent>
				<DialogHeader>Confirm Publication</DialogHeader>
				<DialogBody>
					<VStack gap={4} align="stretch">
						<Text>Are you sure you want to publish &quot;{newsletter.title}&quot; and send it to all subscribers?</Text>
						<Text fontSize="sm" color="gray.500">
							This action cannot be undone.
						</Text>
					</VStack>
				</DialogBody>

				<DialogFooter>
					<Button variant="ghost" mr={3} onClick={onClose}>
						Cancel
					</Button>
					<Button colorScheme="blue" onClick={handlePublish} disabled={isPublishing}>
						Publish
					</Button>
				</DialogFooter>
			</DialogContent>
		</DialogRoot>
	);
}

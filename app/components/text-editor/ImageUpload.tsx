"use client";

import { useState, useRef } from "react";
import { ImageIcon } from "lucide-react";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverBody,
	Button,
	VStack,
	Input,
	FormLabel,
	Box,
	Image,
	Slider,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
	Select,
	Text,
	IconButton,
	useToast,
} from "@chakra-ui/react";

interface ImageUploadButtonProps {
	onImageInsert?: (imageHtml: string) => void;
}

export function ImageUploadButton({ onImageInsert }: ImageUploadButtonProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [imageWidth, setImageWidth] = useState(300);
	const [alignment, setAlignment] = useState("none");
	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const toast = useToast();

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedFile(file);
			const reader = new FileReader();
			reader.onload = (e) => {
				setPreviewUrl(e.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleInsertImage = async () => {
		if (!onImageInsert) {
			toast({
				title: "Implementation Error",
				description: "Please provide an onImageInsert handler to handle inserted images",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
			return;
		}

		if (!selectedFile) return;

		setIsUploading(true);

		try {
			const formData = new FormData();
			formData.append("image", selectedFile);

			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Upload failed");
			}

			const { url } = await response.json();

			const alignClass = alignment !== "none" ? `float-${alignment}` : "";
			const imageHtml = `<div class="image-container" style="text-align: center; margin: 1em 0;" contenteditable="true">
			<img
			  src="${url}"
			  alt="Uploaded image"
			  class="${alignClass}"
			  style="max-width: 100%; width: ${imageWidth}px; display: inline-block;"
			/>
		  </div>`;

			onImageInsert(imageHtml);
			setIsOpen(false);
			setPreviewUrl(null);
			setSelectedFile(null);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		} catch (err) {
			toast({
				title: "Upload Failed",
				description: err instanceof Error ? err.message : "Failed to upload image",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<Popover isOpen={isOpen} onClose={() => setIsOpen(false)} onOpen={() => setIsOpen(true)}>
			<PopoverTrigger>
				<IconButton aria-label="Insert image" icon={<ImageIcon />} variant="ghost" size="sm" />
			</PopoverTrigger>
			<PopoverContent width="320px">
				<PopoverBody>
					<VStack spacing={4} align="stretch">
						<Box>
							<FormLabel>Upload Image</FormLabel>
							<Input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} size="sm" />
						</Box>

						{previewUrl && (
							<>
								<Box>
									<FormLabel>Preview</FormLabel>
									<Box borderWidth={1} borderRadius="md" p={2}>
										<Image src={previewUrl} alt="Preview" width={`${imageWidth}px`} maxWidth="100%" />
									</Box>
								</Box>

								<Box>
									<FormLabel>Width (px): {imageWidth}</FormLabel>
									<Slider value={imageWidth} onChange={(value) => setImageWidth(value)} min={50} max={800} step={10}>
										<SliderTrack>
											<SliderFilledTrack />
										</SliderTrack>
										<SliderThumb />
									</Slider>
								</Box>

								<Box>
									<FormLabel>Alignment</FormLabel>
									<Select value={alignment} onChange={(e) => setAlignment(e.target.value)} size="sm">
										<option value="none">None</option>
										<option value="left">Left</option>
										<option value="right">Right</option>
									</Select>
								</Box>

								<Button onClick={handleInsertImage} colorScheme="blue" width="100%" isLoading={isUploading} loadingText="Uploading...">
									Insert Image
								</Button>
							</>
						)}

						{!onImageInsert && (
							<Text color="red.500" fontSize="sm">
								Warning: No onImageInsert handler provided. Images cannot be inserted.
							</Text>
						)}
					</VStack>
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
}

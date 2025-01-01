"use client";

import { useState, useRef } from "react";
import { ImageIcon } from "lucide-react";
import { Button, VStack, Input, Box, Image, Text, IconButton, SliderTrack, SliderThumb, createListCollection } from "@chakra-ui/react";
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTitle, PopoverTrigger } from "@/src/components/ui/popover";
import { toaster } from "@/src/components/ui/toaster";
import { Field } from "@/src/components/ui/field";
import { Slider } from "@/src/components/ui/slider";
import { SelectContent, SelectItem, SelectRoot, SelectTrigger } from "@/src/components/ui/select";
interface ImageUploadButtonProps {
	onImageInsert?: (imageHtml: string) => void;
}

export function ImageUploadButton({ onImageInsert }: ImageUploadButtonProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [imageWidth, setImageWidth] = useState(300);
	const [alignment, setAlignment] = useState<string[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const alignmentCollection = createListCollection({
		items: [
			{ label: "None", value: "none" },
			{ label: "Left", value: "left" },
			{ label: "Right", value: "right" },
		],
	});

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setSelectedImage(e.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleInsertImage = () => {
		if (!onImageInsert) {
			toaster.create({
				title: "Implementation Error",
				description: "Please provide an onImageInsert handler to handle inserted images",
				type: "error",
				duration: 5000,
			});
			return;
		}

		if (selectedImage) {
			const alignClass = selectedImage !== "none" ? `float-${alignment}` : "";
			const imageHtml = `<div class="image-container" style="text-align: center; margin: 1em 0;" contenteditable="true">
			<img 
			  src="${selectedImage}" 
			  alt="Uploaded image" 
			  class="${alignClass}" 
			  style="max-width: 100%; width: ${imageWidth}px; display: inline-block;"
			/>
		  </div>`;

			onImageInsert(imageHtml);
			setIsOpen(false);
			setSelectedImage(null);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	};

	return (
		<PopoverRoot open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
			<PopoverTrigger>
				<IconButton aria-label="Insert image" variant="ghost" size="sm">
					<ImageIcon />
				</IconButton>
			</PopoverTrigger>
			<PopoverContent width="320px">
				<PopoverBody>
					<VStack gap={4} align="stretch">
						<Box>
							<Field>Upload Image</Field>
							<Input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} size="sm" />
						</Box>

						{selectedImage && (
							<>
								<Box>
									<Field>Preview</Field>
									<Box borderWidth={1} borderRadius="md" p={2}>
										<Image src={selectedImage} alt="Preview" width={`${imageWidth}px`} maxWidth="100%" />
									</Box>
								</Box>

								<Box>
									<Field>Width (px): {imageWidth}</Field>
									<Slider defaultValue={[imageWidth]} onValueChange={(value) => setImageWidth(Number(value))} min={50} max={800} step={10}>
										<SliderTrack>
											<Slider />
										</SliderTrack>
										<SliderThumb index={imageWidth} />
									</Slider>
								</Box>

								<Box>
									<Field>Alignment</Field>
									<SelectRoot value={alignment} onValueChange={(e) => setAlignment(e.value)} collection={alignmentCollection}>
										<SelectContent>
											{alignmentCollection.items.map((position) => (
												<SelectTrigger key={position.value}>
													<SelectItem item={position} key={position.value}>
														{position.label}
													</SelectItem>
												</SelectTrigger>
											))}
										</SelectContent>
									</SelectRoot>
								</Box>

								<Button onClick={handleInsertImage} colorScheme="blue" width="100%">
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
		</PopoverRoot>
	);
}

"use client";

import React, { useState } from "react";
import { Box, VStack, useToast } from "@chakra-ui/react";
import TextEditor from "../text-editor/TextEditor";
import { TextStyle } from "../text-editor/types";

interface NewsletterEditorProps {
	onSave: (title: string, content: string, style: TextStyle, isDraft: boolean) => void;
}

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

const NewsletterEditor: React.FC<NewsletterEditorProps> = ({ onSave }) => {
	const [style, setStyle] = useState<TextStyle>(DEFAULT_STYLE);
	const toast = useToast();

	const handleSave = async (data: { subject: string; content: string; style: TextStyle; isDraft: boolean }) => {
		if (!data.subject.trim()) {
			toast({
				title: "Subject is required",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			return;
		}
		onSave(data.subject, data.content, data.style, data.isDraft);
	};

	return (
		<VStack spacing={4} align="stretch">
			<Box borderWidth={1} borderRadius="md">
				<TextEditor initialStyle={style} onSave={handleSave} />
			</Box>
		</VStack>
	);
};

export default NewsletterEditor;

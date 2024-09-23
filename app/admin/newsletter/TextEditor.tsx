"use client";
import React, { useRef, useState } from "react";
import ContentEditable from "react-contenteditable";
import { Box, Button, Select, HStack } from "@chakra-ui/react";

export default function TextEditor() {
	const textEditorRef = useRef<HTMLDivElement>(null);
	const [text, setText] = useState("");
	const [fontFamily, setFontFamily] = useState("Quicksand");
	const [fontSize, setFontSize] = useState(16);
	const [isBold, setIsBold] = useState(false);
	const [isItalic, setIsItalic] = useState(false);
	const [isUnderline, setIsUnderline] = useState(false);

	const handleChange = (evt: React.FormEvent<HTMLDivElement>) => {
		setText(evt.currentTarget.innerHTML);
	};

	// Apply styles to the selected text and update the state
	const applyStyleToSelection = (style: string, state: boolean) => {
		if (!textEditorRef.current) return;

		const selection = window.getSelection();
		if (!selection || !selection.rangeCount) return;
		const range = selection.getRangeAt(0);
		let styledText: Node | null;

		switch (style) {
			case "bold":
				styledText = document.createElement("strong");
				setIsBold(state);
				break;
			case "italic":
				styledText = document.createElement("em");
				setIsItalic(state);
				break;
			case "underline":
				styledText = document.createElement("u");
				setIsUnderline(state);
				break;
			default:
				return;
		}

		if (styledText) {
			while (range.startContainer.firstChild && !range.collapsed) {
				const node = range.startContainer.removeChild(range.startContainer.firstChild);
				styledText.appendChild(node);
			}

			range.insertNode(styledText);
		} else {
			console.error("Failed to create element for style:", style);
		}
	};

	// Apply font family to the selected text and update the state
	const applyFontFamilyToSelection = (fontFamily: string) => {
		if (!textEditorRef.current) return;

		const selection = window.getSelection();
		if (!selection || !selection.rangeCount) return;
		const range = selection.getRangeAt(0);
		const span = document.createElement("span");
		span.style.fontFamily = fontFamily;
		span.appendChild(range.extractContents());
		range.insertNode(span);
		setFontFamily(fontFamily);
	};

	// Apply font size to the selected text and update the state
	const applyFontSizeToSelection = (fontSize: number) => {
		if (!textEditorRef.current) return;

		const selection = window.getSelection();
		if (!selection || !selection.rangeCount) return;
		const range = selection.getRangeAt(0);
		const span = document.createElement("span");
		span.style.fontSize = `${fontSize}px`;
		span.appendChild(range.extractContents());
		range.insertNode(span);
		setFontSize(fontSize);
	};
	const getStyleObject = (bold: boolean, italic: boolean, underline: boolean) => {
		return {
			minHeight: "200px",
			border: "1px solid #ccc",
			padding: "8px",
			fontFamily,
			fontSize,
			fontWeight: bold ? "bold" : "normal",
			fontStyle: italic ? "italic" : "normal",
			textDecoration: underline ? "underline" : "none",
		};
	};

	return (
		<>
			<Box>
				<HStack spacing={4} mb={4}>
					<Select value={fontFamily} onChange={(e) => applyFontFamilyToSelection(e.target.value)}>
						<option value="Arial">Arial</option>
						<option value="Courier New">Courier New</option>
						<option value="Quicksand">Quicksand</option>
						<option value="Times New Roman">Times New Roman</option>
					</Select>

					<Select value={fontSize} onChange={(e) => applyFontSizeToSelection(Number(e.target.value))}>
						{[12, 14, 16, 18, 20, 24, 30].map((size) => (
							<option key={size} value={size}>
								{size}
							</option>
						))}
					</Select>

					<Button onClick={() => applyStyleToSelection("bold", isBold ? false : true)} variant={isBold ? "solid" : "ghost"} colorScheme="orange">
						Bold
					</Button>
					<Button
						onClick={() => applyStyleToSelection("italic", isItalic ? false : true)}
						variant={isItalic ? "solid" : "ghost"}
						colorScheme="orange">
						Italic
					</Button>
					<Button
						onClick={() => applyStyleToSelection("underline", isUnderline ? false : true)}
						variant={isUnderline ? "solid" : "ghost"}
						colorScheme="orange">
						Underline
					</Button>
				</HStack>

				<ContentEditable
					html={text}
					onChange={handleChange}
					tagName="div"
					style={getStyleObject(isBold, isItalic, isUnderline)}
					innerRef={textEditorRef}
				/>

				<Button mt={4} colorScheme="blue" onClick={() => console.log(text)}>
					Save Text
				</Button>
			</Box>

			<Box mt={4}>
				<h2>Preview</h2>
				<div dangerouslySetInnerHTML={{ __html: text }} style={getStyleObject(isBold, isItalic, isUnderline)} />
			</Box>
		</>
	);
}

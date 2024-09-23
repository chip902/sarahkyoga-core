"use client";
import React, { useRef, useState, useEffect } from "react";
import ContentEditable from "react-contenteditable";
import { Box, Button, Select, HStack, IconButton, Tooltip } from "@chakra-ui/react";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";

export default function TextEditor() {
	const textEditorRef = useRef<HTMLDivElement>(null);
	const [text, setText] = useState("");
	const [fontFamily, setFontFamily] = useState("Quicksand");
	const [fontSize, setFontSize] = useState(16);
	const [isBold, setIsBold] = useState(false);
	const [isItalic, setIsItalic] = useState(false);
	const [isUnderline, setIsUnderline] = useState(false);
	const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left");

	useEffect(() => {
		const saveSelection = () => {
			const selection = window.getSelection();
			if (selection?.rangeCount && textEditorRef.current?.contains(selection.anchorNode)) {
				const range = selection.getRangeAt(0);
				textEditorRef.current.setAttribute("data-selection-start", String(range.startOffset));
				textEditorRef.current.setAttribute("data-selection-end", String(range.endOffset));
			}
		};

		document.addEventListener("selectionchange", saveSelection);
		return () => document.removeEventListener("selectionchange", saveSelection);
	}, []);

	const applyStyleToSelection = (styleProp: string, value: string) => {
		if (!textEditorRef.current) return;

		const selection = window.getSelection();
		if (!selection?.rangeCount) {
			// No selection, apply style to cursor position
			const span = document.createElement("span");
			span.style[styleProp as any] = value;
			span.appendChild(document.createTextNode("\u200B")); // Zero-width space
			insertNodeAtCaret(span);
		} else {
			const range = selection.getRangeAt(0);
			if (textEditorRef.current.contains(range.commonAncestorContainer)) {
				const span = document.createElement("span");
				span.style[styleProp as any] = value;

				// Check if the range is collapsed (cursor position)
				if (range.collapsed) {
					span.appendChild(document.createTextNode("\u200B")); // Zero-width space
					range.insertNode(span);
					range.setStartAfter(span);
				} else {
					range.surroundContents(span);
				}

				selection.removeAllRanges();
				selection.addRange(range);
			}
		}

		updateText();
	};

	const applyTextAlign = (align: "left" | "center" | "right") => {
		if (!textEditorRef.current) return;

		const selection = window.getSelection();
		if (!selection?.rangeCount) return;

		const range = selection.getRangeAt(0);
		if (textEditorRef.current.contains(range.commonAncestorContainer)) {
			let currentNode = range.startContainer;
			while (currentNode !== textEditorRef.current) {
				if (currentNode.nodeType === Node.ELEMENT_NODE) {
					(currentNode as HTMLElement).style.textAlign = align;
				}
				currentNode = currentNode.parentNode as Node;
			}
		}

		updateText();
	};

	const insertNodeAtCaret = (node: Node) => {
		const selection = window.getSelection();
		if (selection?.rangeCount) {
			const range = selection.getRangeAt(0);
			range.insertNode(node);
			range.setStartAfter(node);
			range.setEndAfter(node);
			selection.removeAllRanges();
			selection.addRange(range);
		}
	};

	const updateText = () => {
		if (textEditorRef.current) {
			setText(textEditorRef.current.innerHTML);
		}
	};

	const handleFontFamilyChange = (newFontFamily: string) => {
		setFontFamily(newFontFamily);
		applyStyleToSelection("fontFamily", newFontFamily);
	};

	const handleFontSizeChange = (newFontSize: number) => {
		setFontSize(newFontSize);
		applyStyleToSelection("fontSize", `${newFontSize}px`);
	};

	const toggleStyle = (style: "bold" | "italic" | "underline") => {
		const styleMap = {
			bold: { prop: "fontWeight", value: "bold", default: "normal" },
			italic: { prop: "fontStyle", value: "italic", default: "normal" },
			underline: { prop: "textDecoration", value: "underline", default: "none" },
		};

		const { prop, value, default: defaultValue } = styleMap[style];
		const newState = !eval(`is${style.charAt(0).toUpperCase() + style.slice(1)}`);
		eval(`setIs${style.charAt(0).toUpperCase() + style.slice(1)}(${newState})`);
		applyStyleToSelection(prop, newState ? value : defaultValue);
	};

	const handleTextAlign = (align: "left" | "center" | "right") => {
		setTextAlign(align);
		applyTextAlign(align);
	};

	const handleChange = (evt: React.FormEvent<HTMLDivElement>) => {
		setText(evt.currentTarget.innerHTML);
	};

	return (
		<>
			<Box>
				<HStack spacing={4} mb={4}>
					<Select value={fontFamily} onChange={(e) => handleFontFamilyChange(e.target.value)}>
						<option value="Arial">Arial</option>
						<option value="Courier New">Courier New</option>
						<option value="Quicksand">Quicksand</option>
						<option value="Times New Roman">Times New Roman</option>
					</Select>

					<Select value={fontSize} onChange={(e) => handleFontSizeChange(Number(e.target.value))}>
						{[12, 14, 16, 18, 20, 24, 30].map((size) => (
							<option key={size} value={size}>
								{size}
							</option>
						))}
					</Select>

					<Button onClick={() => toggleStyle("bold")} variant={isBold ? "solid" : "ghost"} colorScheme="orange">
						Bold
					</Button>
					<Button onClick={() => toggleStyle("italic")} variant={isItalic ? "solid" : "ghost"} colorScheme="orange">
						Italic
					</Button>
					<Button onClick={() => toggleStyle("underline")} variant={isUnderline ? "solid" : "ghost"} colorScheme="orange">
						Underline
					</Button>
					<Tooltip label="Align Left">
						<IconButton
							aria-label="Align Left"
							icon={<AlignLeft />}
							onClick={() => handleTextAlign("left")}
							variant={textAlign === "left" ? "solid" : "ghost"}
							colorScheme="blue"
						/>
					</Tooltip>
					<Tooltip label="Align Center">
						<IconButton
							aria-label="Align Center"
							icon={<AlignCenter />}
							onClick={() => handleTextAlign("center")}
							variant={textAlign === "center" ? "solid" : "ghost"}
							colorScheme="blue"
						/>
					</Tooltip>
					<Tooltip label="Align Right">
						<IconButton
							aria-label="Align Right"
							icon={<AlignRight />}
							onClick={() => handleTextAlign("right")}
							variant={textAlign === "right" ? "solid" : "ghost"}
							colorScheme="blue"
						/>
					</Tooltip>
				</HStack>

				<ContentEditable
					html={text}
					onChange={handleChange}
					tagName="div"
					style={{
						minHeight: "200px",
						border: "1px solid #ccc",
						padding: "8px",
					}}
					innerRef={textEditorRef}
				/>

				<Button mt={4} colorScheme="blue" onClick={() => console.log(text)}>
					Save Text
				</Button>
			</Box>

			<Box mt={4}>
				<h2>Preview</h2>
				<div dangerouslySetInnerHTML={{ __html: text }} />
			</Box>
		</>
	);
}

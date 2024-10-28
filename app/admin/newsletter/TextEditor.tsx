"use client";

import React, { useRef, useState, useEffect } from "react";
import ContentEditable from "react-contenteditable";
import { Box, Button, Input, HStack, useToast } from "@chakra-ui/react";
import { convert } from "html-to-text";
import TextEditorToolbar from "./TextEditorToolbar";
import { TextStyle, TextHistory } from "@/types";

const MAX_HISTORY = 100;

interface TextEditorProps {
	initialContent?: string;
	initialStyle?: TextStyle;
	initialSubject?: string;
	newsletterId?: string;
	onSave?: (data: { subject: string; content: string; style: TextStyle; isDraft: boolean }) => Promise<void>;
}

export default function TextEditor({ initialContent = "", initialStyle, initialSubject = "", newsletterId, onSave }: TextEditorProps) {
	const textEditorRef = useRef<HTMLDivElement>(null);
	const [subject, setSubject] = useState(initialSubject);
	const [text, setText] = useState(initialContent);
	const [style, setStyle] = useState<TextStyle>(
		initialStyle || {
			fontFamily: "Quicksand",
			fontSize: 16,
			isBold: false,
			isItalic: false,
			isUnderline: false,
			textAlign: "left",
			textColor: "#000000",
			backgroundColor: "#ffffff",
		}
	);

	const [history, setHistory] = useState<TextHistory[]>([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const [isSaving, setIsSaving] = useState(false);
	const toast = useToast();

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "z") {
				e.preventDefault();
				if (e.shiftKey) {
					handleRedo();
				} else {
					handleUndo();
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [history, historyIndex]);

	useEffect(() => {
		if (history.length === 0 && initialContent) {
			addToHistory(initialContent);
		}
	}, [initialContent]);

	const addToHistory = (content: string) => {
		const newHistory = history.slice(0, historyIndex + 1);
		newHistory.push({ content, timestamp: new Date() });

		if (newHistory.length > MAX_HISTORY) {
			newHistory.shift();
		}

		setHistory(newHistory);
		setHistoryIndex(newHistory.length - 1);
	};

	const handleUndo = () => {
		if (historyIndex > 0) {
			const newIndex = historyIndex - 1;
			setText(history[newIndex].content);
			setHistoryIndex(newIndex);
		}
	};

	const handleRedo = () => {
		if (historyIndex < history.length - 1) {
			const newIndex = historyIndex + 1;
			setText(history[newIndex].content);
			setHistoryIndex(newIndex);
		}
	};

	const applyStyleToSelection = (newStyle: Partial<TextStyle>) => {
		if (!textEditorRef.current) return;

		const selection = window.getSelection();
		if (!selection?.rangeCount) return;

		const range = selection.getRangeAt(0);
		if (textEditorRef.current.contains(range.commonAncestorContainer)) {
			// For text alignment, we need to handle the block-level element
			if ("textAlign" in newStyle) {
				let node = range.commonAncestorContainer;
				while (node && node !== textEditorRef.current) {
					if (node.nodeType === Node.ELEMENT_NODE) {
						(node as HTMLElement).style.textAlign = newStyle.textAlign || "left";
					}
					node = node.parentNode as Node;
				}
			}

			// For other styles, we'll use execCommand for better toggle support
			if ("isBold" in newStyle) {
				document.execCommand("bold", false);
			}
			if ("isItalic" in newStyle) {
				document.execCommand("italic", false);
			}
			if ("isUnderline" in newStyle) {
				document.execCommand("underline", false);
			}
			if ("fontFamily" in newStyle && newStyle.fontFamily) {
				document.execCommand("fontName", false, newStyle.fontFamily);
			}
			if ("fontSize" in newStyle && typeof newStyle.fontSize === "number") {
				// Convert pixel size to a relative size (1-7)
				const size = Math.max(1, Math.min(7, Math.floor(newStyle.fontSize / 4)));
				document.execCommand("fontSize", false, size.toString());
			}
			if ("textColor" in newStyle && newStyle.textColor) {
				document.execCommand("foreColor", false, newStyle.textColor);
			}
			if ("backgroundColor" in newStyle && newStyle.backgroundColor) {
				document.execCommand("backColor", false, newStyle.backgroundColor);
			}

			// Update the current style state based on selection
			const computedStyle = window.getComputedStyle(range.commonAncestorContainer as Element);
			setStyle((prevStyle) => ({
				...prevStyle,
				isBold: document.queryCommandState("bold"),
				isItalic: document.queryCommandState("italic"),
				isUnderline: document.queryCommandState("underline"),
				fontFamily: computedStyle.fontFamily || prevStyle.fontFamily,
				fontSize: parseInt(computedStyle.fontSize) || prevStyle.fontSize,
				textColor: computedStyle.color || prevStyle.textColor,
				backgroundColor: computedStyle.backgroundColor || prevStyle.backgroundColor,
				textAlign: (computedStyle.textAlign as "left" | "center" | "right") || prevStyle.textAlign,
			}));

			updateText();
		}
	};

	const updateText = () => {
		if (textEditorRef.current) {
			const newText = textEditorRef.current.innerHTML;
			setText(newText);
			addToHistory(newText);
		}
	};

	const handleStyleChange = (newStyle: Partial<TextStyle>) => {
		if (!textEditorRef.current) return;

		const selection = window.getSelection();
		if (!selection?.rangeCount) {
			// If no selection, apply style to the whole editor
			textEditorRef.current.focus();
			const range = document.createRange();
			range.selectNodeContents(textEditorRef.current);
			selection?.removeAllRanges();
			selection?.addRange(range);
		}

		applyStyleToSelection(newStyle);
	};

	const handleChange = (evt: React.FormEvent<HTMLDivElement>) => {
		const newText = evt.currentTarget.innerHTML;
		setText(newText);
		addToHistory(newText);
	};

	const handleCopy = async () => {
		const plainText = convert(text, {
			wordwrap: 130,
			preserveNewlines: true,
		});

		try {
			await navigator.clipboard.writeText(plainText);
			toast({
				title: "Copied to clipboard",
				status: "success",
				duration: 2000,
			});
		} catch (err) {
			toast({
				title: "Failed to copy",
				status: "error",
				duration: 2000,
			});
		}
	};

	const handleClear = () => {
		setText("");
		setSubject("");
		addToHistory("");
	};

	const handleSave = async (isDraft: boolean) => {
		if (!subject.trim()) {
			toast({
				title: "Subject is required",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		setIsSaving(true);
		try {
			if (onSave) {
				await onSave({
					subject,
					content: text,
					style,
					isDraft,
				});
				toast({
					title: `Newsletter ${isDraft ? "saved as draft" : "published"}`,
					status: "success",
					duration: 3000,
					isClosable: true,
				});
			}
		} catch (error) {
			toast({
				title: "Error saving newsletter",
				description: error instanceof Error ? error.message : "Unknown error occurred",
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Box bg="white" p={6} borderRadius="lg" boxShadow="lg">
			<Input
				placeholder="Newsletter Subject"
				value={subject}
				onChange={(e) => setSubject(e.target.value)}
				mb={4}
				size="lg"
				fontWeight="bold"
				color="gray.800"
				bg="white"
			/>

			<TextEditorToolbar
				style={style}
				onStyleChange={handleStyleChange}
				onUndo={handleUndo}
				onRedo={handleRedo}
				onCopy={handleCopy}
				onClear={handleClear}
				canUndo={historyIndex > 0}
				canRedo={historyIndex < history.length - 1}
			/>

			<Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="md" mt={4}>
				<ContentEditable
					html={text}
					onChange={handleChange}
					tagName="div"
					style={{
						minHeight: "300px",
						padding: "16px",
						outline: "none",
						backgroundColor: "#ffffff",
						color: "#000000",
						fontFamily: style.fontFamily,
						fontSize: `${style.fontSize}px`,
					}}
					innerRef={textEditorRef}
				/>
			</Box>

			<HStack mt={4} spacing={4}>
				<Button colorScheme="blue" onClick={() => handleSave(true)} isLoading={isSaving}>
					Save as Draft
				</Button>
				<Button colorScheme="green" onClick={() => handleSave(false)} isLoading={isSaving}>
					Publish
				</Button>
			</HStack>

			<Box mt={6} p={4} borderRadius="md" bg="white">
				<h2 className="text-xl font-semibold mb-2 text-gray-900">Preview</h2>
				<div className="prose max-w-none text-gray-900 text-editor-content" dangerouslySetInnerHTML={{ __html: text }} />
			</Box>
		</Box>
	);
}

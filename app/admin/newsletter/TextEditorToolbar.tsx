"use client";

import React from "react";
import { HStack, Select, Button, IconButton, Tooltip, Popover, PopoverTrigger, PopoverContent, Box } from "@chakra-ui/react";
import type { ColorResult } from "react-color";
import { ChromePicker } from "react-color";
import { AlignLeft, AlignCenter, AlignRight, Type, Bold, Italic, Underline, Palette, RotateCcw, RotateCw, Copy, Trash2 } from "lucide-react";
import { TextStyle } from "@/types";

interface TextEditorToolbarProps {
	style: TextStyle;
	onStyleChange: (style: Partial<TextStyle>) => void;
	onUndo: () => void;
	onRedo: () => void;
	onCopy: () => void;
	onClear: () => void;
	canUndo: boolean;
	canRedo: boolean;
}

const FONT_SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];
const FONT_FAMILIES = ["Arial", "Courier New", "Georgia", "Helvetica", "Quicksand", "Times New Roman", "Trebuchet MS", "Verdana"];

export default function TextEditorToolbar({ style, onStyleChange, onUndo, onRedo, onCopy, onClear, canUndo, canRedo }: TextEditorToolbarProps) {
	const handleTextColorChange = (color: ColorResult) => {
		onStyleChange({ textColor: color.hex });
	};

	const handleBackgroundColorChange = (color: ColorResult) => {
		onStyleChange({ backgroundColor: color.hex });
	};

	return (
		<HStack spacing={2} mb={4} flexWrap="wrap">
			<Select value={style.fontFamily} onChange={(e) => onStyleChange({ fontFamily: e.target.value })} width="150px" bg="white" color="gray.800">
				{FONT_FAMILIES.map((font) => (
					<option key={font} value={font}>
						{font}
					</option>
				))}
			</Select>

			<Select value={style.fontSize} onChange={(e) => onStyleChange({ fontSize: Number(e.target.value) })} width="80px" bg="white" color="gray.800">
				{FONT_SIZES.map((size) => (
					<option key={size} value={size}>
						{size}
					</option>
				))}
			</Select>

			<Button
				onClick={() => onStyleChange({ isBold: !style.isBold })}
				variant={style.isBold ? "solid" : "ghost"}
				colorScheme="orange"
				size="sm"
				color={style.isBold ? "white" : "gray.800"}>
				<Bold size={16} />
			</Button>

			<Button onClick={() => onStyleChange({ isItalic: !style.isItalic })} variant={style.isItalic ? "solid" : "ghost"} colorScheme="orange" size="sm">
				<Italic size={16} />
			</Button>

			<Button
				onClick={() => onStyleChange({ isUnderline: !style.isUnderline })}
				variant={style.isUnderline ? "solid" : "ghost"}
				colorScheme="orange"
				size="sm">
				<Underline size={16} />
			</Button>

			<Tooltip label="Align Left">
				<IconButton
					aria-label="Align Left"
					icon={<AlignLeft size={16} />}
					onClick={() => onStyleChange({ textAlign: "left" })}
					variant={style.textAlign === "left" ? "solid" : "ghost"}
					colorScheme="blue"
					size="sm"
				/>
			</Tooltip>

			<Tooltip label="Align Center">
				<IconButton
					aria-label="Align Center"
					icon={<AlignCenter size={16} />}
					onClick={() => onStyleChange({ textAlign: "center" })}
					variant={style.textAlign === "center" ? "solid" : "ghost"}
					colorScheme="blue"
					size="sm"
				/>
			</Tooltip>

			<Tooltip label="Align Right">
				<IconButton
					aria-label="Align Right"
					icon={<AlignRight size={16} />}
					onClick={() => onStyleChange({ textAlign: "right" })}
					variant={style.textAlign === "right" ? "solid" : "ghost"}
					colorScheme="blue"
					size="sm"
				/>
			</Tooltip>

			<Popover>
				<PopoverTrigger>
					<IconButton aria-label="Text Color" icon={<Type size={16} />} size="sm" bg="white" color="gray.800" />
				</PopoverTrigger>
				<PopoverContent p={2}>
					<ChromePicker color={style.textColor} onChange={(color: ColorResult) => onStyleChange({ textColor: color.hex })} />
				</PopoverContent>
			</Popover>

			<Popover>
				<PopoverTrigger>
					<IconButton aria-label="Background Color" icon={<Palette size={16} />} size="sm" bg="white" color="gray.800" />
				</PopoverTrigger>
				<PopoverContent p={2}>
					<ChromePicker color={style.backgroundColor} onChange={(color: ColorResult) => onStyleChange({ backgroundColor: color.hex })} />
				</PopoverContent>
			</Popover>

			<Tooltip label="Undo">
				<IconButton aria-label="Undo" icon={<RotateCcw size={16} />} onClick={onUndo} isDisabled={!canUndo} size="sm" />
			</Tooltip>

			<Tooltip label="Redo">
				<IconButton aria-label="Redo" icon={<RotateCw size={16} />} onClick={onRedo} isDisabled={!canRedo} size="sm" />
			</Tooltip>

			<Tooltip label="Copy">
				<IconButton aria-label="Copy" icon={<Copy size={16} />} onClick={onCopy} size="sm" />
			</Tooltip>

			<Tooltip label="Clear">
				<IconButton aria-label="Clear" icon={<Trash2 size={16} />} onClick={onClear} colorScheme="red" size="sm" />
			</Tooltip>
		</HStack>
	);
}

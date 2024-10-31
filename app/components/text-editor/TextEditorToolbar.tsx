"use client";

import React from "react";
import dynamic from "next/dynamic";
import { HStack, Select, IconButton, Tooltip, Popover, PopoverTrigger, PopoverContent, Box } from "@chakra-ui/react";
import type { ColorResult } from "react-color";
import { AlignLeft, AlignCenter, AlignRight, Type, Bold, Italic, Underline, Palette, RotateCcw, RotateCw, Copy, Trash2 } from "lucide-react";
import { TextStyle } from "./types";
import { ImageUploadButton } from "./ImageUpload";

const ColorPicker = dynamic(() => import("./ColorPicker"), {
	ssr: false,
});

const FONT_FAMILIES = ["Quicksand", "Arial", "Courier New", "Georgia", "Times New Roman"];
const FONT_SIZES = [12, 14, 16, 18, 20, 24, 30];

interface TextEditorToolbarProps {
	style: TextStyle;
	onStyleChange: (style: Partial<TextStyle>) => void;
	onUndo: () => void;
	onRedo: () => void;
	onCopy: () => void;
	onClear: () => void;
	canUndo: boolean;
	canRedo: boolean;
	onImageInsert?: (imageHtml: string) => void;
}

export default function TextEditorToolbar({ style, onStyleChange, onUndo, onRedo, onCopy, onClear, canUndo, canRedo, onImageInsert }: TextEditorToolbarProps) {
	const getButtonStyles = (isActive: boolean) => ({
		bg: isActive ? "#cc7152" : "gray.100",
		color: isActive ? "white" : "gray.800",
		_hover: {
			bg: isActive ? "#b86447" : "gray.200",
		},
		_active: {
			bg: isActive ? "#a55a40" : "gray.300",
		},
	});

	return (
		<Box bg="white" p={2} borderRadius="md" borderWidth="1px" borderColor="gray.200" shadow="sm">
			<HStack spacing={2} flexWrap="wrap">
				<Select
					value={style.fontFamily}
					onChange={(e) => onStyleChange({ fontFamily: e.target.value })}
					width="150px"
					size="sm"
					bg="white"
					color="gray.800"
					borderColor="gray.200"
					_focus={{
						borderColor: "#cc7152",
						boxShadow: "0 0 0 1px #cc7152",
					}}>
					{FONT_FAMILIES.map((font) => (
						<option key={font} value={font}>
							{font}
						</option>
					))}
				</Select>

				<Select
					value={style.fontSize}
					onChange={(e) => onStyleChange({ fontSize: Number(e.target.value) })}
					width="80px"
					size="sm"
					bg="white"
					color="gray.800"
					borderColor="gray.200"
					_focus={{
						borderColor: "#cc7152",
						boxShadow: "0 0 0 1px #cc7152",
					}}>
					{FONT_SIZES.map((size) => (
						<option key={size} value={size}>
							{size}
						</option>
					))}
				</Select>

				<Tooltip label="Bold">
					<IconButton
						aria-label="Bold"
						icon={<Bold size={16} />}
						onClick={() => onStyleChange({ isBold: !style.isBold })}
						size="sm"
						{...getButtonStyles(style.isBold)}
					/>
				</Tooltip>

				<Tooltip label="Italic">
					<IconButton
						aria-label="Italic"
						icon={<Italic size={16} />}
						onClick={() => onStyleChange({ isItalic: !style.isItalic })}
						size="sm"
						{...getButtonStyles(style.isItalic)}
					/>
				</Tooltip>

				<Tooltip label="Underline">
					<IconButton
						aria-label="Underline"
						icon={<Underline size={16} />}
						onClick={() => onStyleChange({ isUnderline: !style.isUnderline })}
						size="sm"
						{...getButtonStyles(style.isUnderline)}
					/>
				</Tooltip>

				<Tooltip label="Align Left">
					<IconButton
						aria-label="Align Left"
						icon={<AlignLeft size={16} />}
						onClick={() => onStyleChange({ textAlign: "left" })}
						size="sm"
						{...getButtonStyles(style.textAlign === "left")}
					/>
				</Tooltip>

				<Tooltip label="Align Center">
					<IconButton
						aria-label="Align Center"
						icon={<AlignCenter size={16} />}
						onClick={() => onStyleChange({ textAlign: "center" })}
						size="sm"
						{...getButtonStyles(style.textAlign === "center")}
					/>
				</Tooltip>

				<Tooltip label="Align Right">
					<IconButton
						aria-label="Align Right"
						icon={<AlignRight size={16} />}
						onClick={() => onStyleChange({ textAlign: "right" })}
						size="sm"
						{...getButtonStyles(style.textAlign === "right")}
					/>
				</Tooltip>

				<Popover>
					<PopoverTrigger>
						<IconButton aria-label="Text Color" icon={<Type size={16} />} size="sm" {...getButtonStyles(false)} />
					</PopoverTrigger>
					<PopoverContent p={2}>
						<ColorPicker color={style.textColor} onChange={(color: ColorResult) => onStyleChange({ textColor: color.hex })} />
					</PopoverContent>
				</Popover>

				<Popover>
					<PopoverTrigger>
						<IconButton aria-label="Background Color" icon={<Palette size={16} />} size="sm" {...getButtonStyles(false)} />
					</PopoverTrigger>
					<PopoverContent p={2}>
						<ColorPicker color={style.backgroundColor} onChange={(color: ColorResult) => onStyleChange({ backgroundColor: color.hex })} />
					</PopoverContent>
				</Popover>

				<Tooltip label="Undo">
					<IconButton
						aria-label="Undo"
						icon={<RotateCcw size={16} />}
						onClick={onUndo}
						isDisabled={!canUndo}
						size="sm"
						{...getButtonStyles(false)}
						opacity={canUndo ? 1 : 0.5}
					/>
				</Tooltip>

				<Tooltip label="Redo">
					<IconButton
						aria-label="Redo"
						icon={<RotateCw size={16} />}
						onClick={onRedo}
						isDisabled={!canRedo}
						size="sm"
						{...getButtonStyles(false)}
						opacity={canRedo ? 1 : 0.5}
					/>
				</Tooltip>

				<Tooltip label="Upload an Image">
					<ImageUploadButton onImageInsert={onImageInsert} />
				</Tooltip>

				<Tooltip label="Copy">
					<IconButton aria-label="Copy" icon={<Copy size={16} />} onClick={onCopy} size="sm" {...getButtonStyles(false)} />
				</Tooltip>

				<Tooltip label="Clear">
					<IconButton aria-label="Clear" icon={<Trash2 size={16} />} onClick={onClear} size="sm" {...getButtonStyles(false)} />
				</Tooltip>
			</HStack>
		</Box>
	);
}

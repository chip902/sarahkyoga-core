"use client";

import React from "react";
import { ChromePicker } from "react-color";
import type { ColorResult } from "react-color";

interface ColorPickerProps {
	color: string;
	onChange: (color: ColorResult) => void;
}

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
	return <ChromePicker color={color} onChange={onChange} />;
}

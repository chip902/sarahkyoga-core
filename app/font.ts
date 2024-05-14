"use client";
import { Quicksand } from "next/font/google";

const quicksand = Quicksand({
	subsets: ["latin"],
	variable: "--font-quicksand",
});

export const font = {
	quicksand,
};

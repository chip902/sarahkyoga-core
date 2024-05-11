import { theme } from "@chakra-ui/pro-theme";
import { extendTheme } from "@chakra-ui/react";

const proTheme = extendTheme(theme);
const extendedConfig = {
	colors: {
		...proTheme.colors,
		brand: {
			100: "#cc7152",
			200: "#03131e",
			300: "#0c131d",
			400: "#38383a",
			500: "#443c3b",
			600: "#a2684d",
			700: "#e0b78f",
			800: "#02121d",
		},
	},
	fonts: {
		heading: "var(--font-quicksand)",
		body: "var(--font-quicksand)",
	},
};
export const skyTheme = extendTheme(extendedConfig, proTheme);

import { theme } from "@chakra-ui/pro-theme";
import { extendTheme } from "@chakra-ui/react";

const proTheme = extendTheme(theme);
const imageConfig = {
	components: {
		Image: {
			global: {
				shadow: "2xl",
			},
		},
	},
};
const breakpoints = {
	sm: "30em",
	base: "48em",
	lg: "62em",
	xl: "80em",
	"2xl": "96em",
};

const extension = {
	styles: {
		global: {
			body: {
				backgroundImage: "url('/background.jpg')",
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
			},
		},
		variants: {
			nav: {
				backgroundColor: "#000000",
			},
		},
	},
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
};

const buttonLink = {
	components: {
		Link: {
			baseStyle: {
				position: "relative",
				textDecoration: "none",
				_hover: {
					textDecoration: "none",
				},
			},
			variants: {
				linkNav: {
					position: "relative",
					textDecoration: "none",
					_hover: {
						textDecoration: "none",
						_after: {
							width: "100%",
							backgroundColor: "brand.100", // Ensuring the color is set on hover
						},
					},
					_after: {
						content: '""',
						position: "absolute",
						width: "0",
						height: "3px",
						backgroundColor: "brand.100", // Color of the underline
						bottom: "-10px", // Adjusted for more spacing from the text
						left: "0", // Start from the left edge
						transform: "translateX(0%)", // Adjust transform to start the effect from the left
						transition: "width 0.3s ease-out",
					},
				},
			},
		},
	},
};

const fontConfig = {
	fonts: {
		body: "Quicksand, system-ui, sans-serif",
		nav: "Quicksand, system-ui, sans-serif",
		heading: "Quicksand, Georgia, serif",
		mono: "Menlo, monospace",
	},
	fontSizes: {
		xs: "0.75rem",
		sm: "0.875rem",
		md: "1rem",
		lg: "1.125rem",
		xl: "1.25rem",
		"2xl": "1.5rem",
		"3xl": "1.875rem",
		"4xl": "2.25rem",
		"5xl": "3rem",
		"6xl": "3.75rem",
		"7xl": "4.5rem",
		"8xl": "6rem",
		"9xl": "8rem",
	},
	fontWeights: {
		hairline: 100,
		thin: 200,
		light: 300,
		normal: 400,
		medium: 500,
		semibold: 600,
		bold: 700,
		extrabold: 800,
		black: 900,
	},
	lineHeights: {
		normal: "normal",
		none: 1,
		shorter: 1.25,
		short: 1.375,
		base: 1.5,
		tall: 1.625,
		taller: "2",
		"3": ".75rem",
		"4": "1rem",
		"5": "1.25rem",
		"6": "1.5rem",
		"7": "1.75rem",
		"8": "2rem",
		"9": "2.25rem",
		"10": "2.5rem",
	},
	letterSpacings: {
		tighter: "-0.05em",
		tight: "-0.025em",
		normal: "0",
		wide: "0.025em",
		wider: "0.05em",
		widest: "0.1em",
	},
};

const extendedConfig = extendTheme({ ...fontConfig, ...extension, ...imageConfig, ...buttonLink });

export const skyTheme = extendTheme(proTheme, extendedConfig);

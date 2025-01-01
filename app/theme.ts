import { defineTokens, defineGlobalStyles, defaultConfig, createSystem } from "@chakra-ui/react";
import { defineStyleConfig } from "@chakra-ui/styled-system";
import { theme as proTheme } from "@chakra-ui/pro-theme";

/* -----------------------------------------------------------------------------
	1) Define your raw tokens using "defineTokens"
	   (Colors, fonts, fontSizes, breakpoints, etc.)
  ----------------------------------------------------------------------------- */
const tokens = defineTokens({
	config: {
		// Still supports color-mode config
		initialColorMode: { value: "light" },
		useSystemColorMode: { value: false },
	},

	breakpoints: {
		sm: { value: "30em" },
		base: { value: "48em" },
		lg: { value: "62em" },
		xl: { value: "80em" },
		"2xl": { value: "96em" },
	},

	fonts: {
		heading: { value: "var(--font-quicksand)" },
		body: { value: "var(--font-quicksand)" },
		mono: { value: "Menlo, monospace" },
	},

	fontSizes: {
		xs: { value: "0.75rem" },
		sm: { value: "0.875rem" },
		md: { value: "1rem" },
		lg: { value: "1.125rem" },
		xl: { value: "1.25rem" },
		"2xl": { value: "1.5rem" },
		"3xl": { value: "1.875rem" },
		"4xl": { value: "2.25rem" },
		"5xl": { value: "3rem" },
		"6xl": { value: "3.75rem" },
		"7xl": { value: "4.5rem" },
		"8xl": { value: "6rem" },
		"9xl": { value: "8rem" },
	},

	fontWeights: {
		hairline: { value: 100 },
		thin: { value: 200 },
		light: { value: 300 },
		normal: { value: 400 },
		medium: { value: 500 },
		semibold: { value: 600 },
		bold: { value: 700 },
		extrabold: { value: 800 },
		black: { value: 900 },
	},

	lineHeights: {
		normal: { value: "normal" },
		none: { value: 1 },
		shorter: { value: 1.25 },
		short: { value: 1.375 },
		base: { value: 1.5 },
		tall: { value: 1.625 },
		taller: { value: "2" },
		"3": { value: ".75rem" },
		"4": { value: "1rem" },
		"5": { value: "1.25rem" },
		"6": { value: "1.5rem" },
		"7": { value: "1.75rem" },
		"8": { value: "2rem" },
		"9": { value: "2.25rem" },
		"10": { value: "2.5rem" },
	},

	letterSpacings: {
		tighter: { value: "-0.05em" },
		tight: { value: "-0.025em" },
		normal: { value: "0" },
		wide: { value: "0.025em" },
		wider: { value: "0.05em" },
		widest: { value: "0.1em" },
	},

	colors: {
		brand: {
			"100": { value: "#cc7152" },
			"200": { value: "#03131e" },
			"300": { value: "#0c131d" },
			"400": { value: "#38383a" },
			"500": { value: "#443c3b" },
			"600": { value: "#a2684d" },
			"700": { value: "#e0b78f" },
			"800": { value: "#02121d" },
			// If you used brand.900 in your theme, define it too:
			"900": { value: "#bf4b36" },
		},
	},
});

/* -----------------------------------------------------------------------------
	2) Global styles using "defineGlobalStyles"
	   (E.g., your background, base body styles)
  ----------------------------------------------------------------------------- */
const globalStyles = defineGlobalStyles({
	body: {
		backgroundImage: "url('/background.jpg')",
		backgroundSize: "cover",
		backgroundPosition: "center",
		backgroundRepeat: "no-repeat",
		fontFamily: "var(--font-quicksand)",
		color: "grey.800",
	},
});

/* -----------------------------------------------------------------------------
	3) Component overrides using "defineStyleConfig"
	   (Matches your old v2 definitions but reorganized)
  ----------------------------------------------------------------------------- */

// 3.1) Link
const linkTheme = defineStyleConfig({
	baseStyle: {
		position: "relative",
		textDecoration: "none",
		_hover: { textDecoration: "none" },
	},
	variants: {
		linkNav: {
			marginX: 5,
			padding: 1,
			fontSize: "lg",
			position: "relative",
			textDecoration: "none",
			_hover: {
				textDecoration: "none",
				_after: {
					width: "100%",
					backgroundColor: "brand.100",
				},
			},
			_after: {
				content: '""',
				position: "absolute",
				width: "0",
				height: "3px",
				backgroundColor: "brand.100",
				bottom: "-6px",
				left: "0",
				transition: "width 0.3s ease-out",
			},
		},
		inlineNav: {
			padding: 1,
			fontSize: "xl",
			fontWeight: "bold",
			position: "relative",
			textDecoration: "none",
			_hover: {
				textDecoration: "none",
				_after: {
					width: "100%",
					backgroundColor: "brand.100",
				},
			},
			_after: {
				content: '""',
				position: "absolute",
				width: "0",
				height: "3px",
				backgroundColor: "brand.100",
				bottom: "-6px",
				left: "0",
				transition: "width 0.3s ease-out",
			},
		},
	},
});

// 3.2) Button
const buttonTheme = defineStyleConfig({
	variants: {
		linkNav: {
			marginX: 5,
			padding: 1,
			fontSize: "lg",
			position: "relative",
			textDecoration: "none",
			backgroundColor: "transparent",
			color: "brand.100",
			_hover: {
				backgroundColor: "transparent",
				textDecoration: "none",
				_after: {
					width: "100%",
					backgroundColor: "brand.100",
				},
			},
			_after: {
				content: '""',
				position: "absolute",
				width: "0",
				height: "3px",
				bottom: "-6px",
				left: "0",
				backgroundColor: "brand.100",
				transition: "width 0.3s ease-out",
			},
		},
		inline: {
			fontSize: "md",
			fontWeight: "bold",
			position: "relative",
			textDecoration: "none",
			_hover: {
				textDecoration: "none",
				_after: {
					width: "100%",
					backgroundColor: "brand.100",
				},
			},
			_after: {
				content: '""',
				position: "absolute",
				width: "0",
				height: "3px",
				backgroundColor: "brand.100",
				bottom: "-3px",
				left: "0",
				transition: "width 0.3s ease-out",
			},
		},
		outline: {
			fontSize: "md",
			color: "white",
			position: "relative",
			textDecoration: "none",
		},
		cta: {
			marginX: 5,
			marginTop: 5,
			paddingY: 2,
			paddingX: [2, 2],
			backgroundColor: "brand.900", // Adjust if needed
			fontWeight: "bold",
			borderRadius: "8px",
			_hover: {
				backgroundColor: "#bf4b36",
				transform: "translateY(-1px)",
				transition: "0.3s ease-out",
				_after: {
					width: [90, "75%", "72.5%", "80%"],
					height: "3px",
					left: 65,
				},
			},
		},
		preview: {
			backgroundColor: "brand.900",
			fontWeight: "bold",
			borderRadius: "8px",
			_hover: {
				backgroundColor: "#bf4b36",
				color: "white",
				transform: "translateY(-1px)",
				transition: "0.3s ease-out",
				_after: {
					width: [90, "75%", "72.5%", "80%"],
					height: "3px",
					left: 65,
				},
			},
		},
	},
});

// 3.3) Card
const cardTheme = defineStyleConfig({
	variants: {
		productCard: {
			width: "calc(100vw - 4rem)",
			boxShadow: "dark-lg",
			borderRadius: "8px",
			backgroundColor: "transparent",
			color: "gray.900",
		},
	},
});

// 3.4) Tabs
const tabsTheme = defineStyleConfig({
	variants: {
		enclosed: {
			tab: {
				color: "gray.600",
				bg: "gray.50",
				borderColor: "gray.200",
				marginBottom: "-1px",
				_selected: {
					color: "brand.100",
					bg: "white",
					borderColor: "gray.200",
					borderBottomColor: "white",
				},
				_hover: {
					color: "brand.100",
				},
			},
			tablist: {
				borderBottom: "1px solid",
				borderColor: "gray.200",
			},
			tabpanel: {
				bg: "white",
				borderX: "1px solid",
				borderBottom: "1px solid",
				borderColor: "gray.200",
				pt: 4,
			},
		},
	},
});

// 3.5) Input
const inputTheme = defineStyleConfig({
	variants: {
		outline: {
			field: {
				bg: "white",
				color: "gray.800",
				borderColor: "gray.200",
				_placeholder: {
					color: "gray.400",
				},
				_hover: {
					borderColor: "gray.300",
				},
				_focus: {
					borderColor: "brand.100",
					boxShadow: "0 0 0 1px #cc7152",
				},
			},
		},
	},
	defaultProps: {
		variant: "outline",
	},
});

// 3.6) Menu
const menuTheme = defineStyleConfig({
	baseStyle: {
		list: {
			bg: "white",
			boxShadow: "lg",
			color: "brand.100",
			borderRadius: "md",
			border: "none",
			padding: 2,
			minW: "200px",
		},
		item: {
			bg: "transparent",
			color: "brand.100",
			_hover: {
				bg: "gray.50",
			},
			_focus: {
				bg: "gray.50",
			},
		},
	},
});

// 3.7) Text
const textTheme = defineStyleConfig({
	baseStyle: {
		color: "gray.800",
	},
	variants: {
		linkNav: {
			marginX: 5,
			padding: 1,
			fontSize: "lg",
			position: "relative",
			textDecoration: "none",
			_hover: {
				textDecoration: "none",
				_after: {
					width: "100%",
					backgroundColor: "brand.100",
				},
			},
			_after: {
				content: '""',
				position: "absolute",
				width: "0",
				height: "3px",
				backgroundColor: "brand.100",
				bottom: "-6px",
				left: "0",
				transition: "width 0.3s ease-out",
			},
		},
		inline: {
			fontSize: "md",
			fontWeight: "bold",
			position: "relative",
			textDecoration: "none",
			_hover: {
				textDecoration: "none",
				_after: {
					width: "100%",
					backgroundColor: "brand.100",
				},
			},
			_after: {
				content: '""',
				position: "absolute",
				width: "0",
				height: "3px",
				backgroundColor: "brand.100",
				bottom: "-3px",
				left: "0",
				transition: "width 0.3s ease-out",
			},
		},
		outline: {
			fontSize: "md",
			color: "white",
			position: "relative",
			textDecoration: "none",
		},
	},
});

const customTheme = {
	// (A) Spread the Pro Theme first
	...proTheme,

	// (B) Override or add your tokens inside the theme shape
	breakpoints: {
		sm: tokens.breakpoints.sm.value,
		base: tokens.breakpoints.base.value,
		lg: tokens.breakpoints.lg.value,
		xl: tokens.breakpoints.xl.value,
		"2xl": tokens.breakpoints["2xl"].value,
	},

	fonts: {
		heading: tokens.fonts.heading.value,
		body: tokens.fonts.body.value,
		mono: tokens.fonts.mono.value,
	},

	fontSizes: {
		xs: tokens.fontSizes.xs.value,
		sm: tokens.fontSizes.sm.value,
		md: tokens.fontSizes.md.value,
		// etc.
	},

	fontWeights: {
		hairline: tokens.fontWeights.hairline.value,
		thin: tokens.fontWeights.thin.value,
		// etc.
	},

	lineHeights: {
		normal: tokens.lineHeights.normal.value,
		none: tokens.lineHeights.none.value,
		// etc.
	},

	letterSpacings: {
		tighter: tokens.letterSpacings.tighter.value,
		tight: tokens.letterSpacings.tight.value,
		// etc.
	},

	colors: {
		// If proTheme already has colors, you can spread them:
		...proTheme,
		brand: {
			100: tokens.colors.brand["100"].value,
			200: tokens.colors.brand["200"].value,
			300: tokens.colors.brand["300"].value,
			400: tokens.colors.brand["400"].value,
			500: tokens.colors.brand["500"].value,
			600: tokens.colors.brand["600"].value,
			700: tokens.colors.brand["700"].value,
			800: tokens.colors.brand["800"].value,
			900: tokens.colors.brand["900"].value,
		},
	},

	// (C) Global styles
	styles: globalStyles,

	// (D) Components
	components: {
		...proTheme,
		Link: linkTheme,
		Button: buttonTheme,
		Card: cardTheme,
		Tabs: tabsTheme,
		Input: inputTheme,
		Menu: menuTheme,
		Text: textTheme,
	},
};

/* -----------------------------------------------------------------------------
	4) Combine everything with "createTheme"
	   - First spread in proTheme for baseline
	   - Then add tokens, global styles, and components
  ----------------------------------------------------------------------------- */
export const skyTheme = createSystem(
	defaultConfig,

	// 2) The second argument is an object with a `theme` key
	{
		theme: customTheme,
	}
);

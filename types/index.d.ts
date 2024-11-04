export interface TextStyle {
	fontFamily: string;
	fontSize: number;
	isBold: boolean;
	isItalic: boolean;
	isUnderline: boolean;
	textAlign: "left" | "center" | "right";
	textColor: string;
	backgroundColor: string;
}

export interface TextSelection {
	start: number;
	end: number;
}

export interface TextHistory {
	content: string;
	timestamp: Date;
}

export interface CartItem {
	id: string;
	quantity: number;
	product: {
		id: string;
		name: string;
		price: number;
		description?: string;
		// Add any other product fields you need
	};
}

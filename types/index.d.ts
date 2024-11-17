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

// Extend the CartItem type to include product data
export interface CartItem {
	id: string;
	cartId: string;
	productId?: string;
	quantity: number;
	createdAt?: Date;
	updatedAt?: Date;
	product: Product;
}
export interface Product {
	id: string;
	name: string;
	description?: string | null;
	price: number;
	duration?: number | null;
	availableSlots?: number | null;
	createdAt: Date;
	updatedAt: Date;
	imageUrl?: string | null;
}
export interface ShoppingCartPopoutProps {
	isResponsive: boolean;
}
export interface EmailTemplate {
	subject: string;
	text: string;
	html: string;
}

export interface Order {
	id: string;
	userId: string;
	total: number;
	status: string;
	orderNumber: string;
	createdAt: Date;
	updatedAt: Date;
	user?: {
		firstName: string;
		lastName: string;
		email: string;
	};
	item?: {
		id: string;
		name: string;
	};
}
export interface SortConfig {
	key: string | string[];
	direction: "ascending" | "descending";
}

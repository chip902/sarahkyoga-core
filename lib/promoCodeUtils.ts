// lib/promoCodeUtils.ts

/**
 * Generates a random alphanumeric promo code of specified length
 * @param length - Length of the promo code (default: 10)
 * @returns A random alphanumeric string in uppercase
 */
export function generatePromoCode(length: number = 10): string {
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let code = "";

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		code += characters.charAt(randomIndex);
	}

	return code;
}

/**
 * Validates if a promo code string matches the expected format
 * @param code - The promo code to validate
 * @param length - Expected length (default: 10)
 * @returns true if the code matches the format, false otherwise
 */
export function validatePromoCodeFormat(code: string, length: number = 10): boolean {
	if (!code || code.length !== length) {
		return false;
	}

	// Check if code contains only alphanumeric characters
	const alphanumericRegex = /^[A-Z0-9]+$/;
	return alphanumericRegex.test(code.toUpperCase());
}

/**
 * Calculate discount amount based on promo code type and value
 * @param type - Type of promo code (PERCENTAGE, FIXED_AMOUNT, FREE_CLASS)
 * @param value - Discount value
 * @param total - Original total amount
 * @returns Discounted amount
 */
export function calculateDiscount(
	type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_CLASS",
	value: number,
	total: number
): number {
	switch (type) {
		case "PERCENTAGE":
			return total * (value / 100);
		case "FIXED_AMOUNT":
			return Math.min(value, total); // Don't discount more than the total
		case "FREE_CLASS":
			return total; // Free class means 100% discount
		default:
			return 0;
	}
}

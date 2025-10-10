// app/api/promo-code/validate/route.ts

import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { calculateDiscount } from "@/lib/promoCodeUtils";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { code, total } = body;

		// Validate inputs
		if (!code || !total) {
			return NextResponse.json({ error: "Code and total are required" }, { status: 400 });
		}

		// Find the promo code
		const promoCode = await prisma.promoCode.findUnique({
			where: {
				code: code.toUpperCase(),
			},
		});

		if (!promoCode) {
			return NextResponse.json({ error: "Invalid promo code" }, { status: 404 });
		}

		// Check if promo code is active
		if (!promoCode.isActive) {
			return NextResponse.json({ error: "This promo code is no longer active" }, { status: 400 });
		}

		// Check if promo code has expired
		if (promoCode.expiresAt && new Date(promoCode.expiresAt) < new Date()) {
			return NextResponse.json({ error: "This promo code has expired" }, { status: 400 });
		}

		// Check if promo code has reached max uses
		if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) {
			return NextResponse.json({ error: "This promo code has reached its usage limit" }, { status: 400 });
		}

		// Calculate discount
		const discountAmount = calculateDiscount(promoCode.type, promoCode.value, total);

		// Return success with promo code details
		return NextResponse.json(
			{
				valid: true,
				promoCode: {
					id: promoCode.id,
					code: promoCode.code,
					type: promoCode.type,
					value: promoCode.value,
					description: promoCode.description,
				},
				discountAmount,
				newTotal: Math.max(0, total - discountAmount),
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error validating promo code:", error);
		return NextResponse.json({ error: "Failed to validate promo code" }, { status: 500 });
	}
}

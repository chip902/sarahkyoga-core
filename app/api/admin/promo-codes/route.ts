// app/api/admin/promo-codes/route.ts

import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generatePromoCode } from "@/lib/promoCodeUtils";

// GET all promo codes
export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		// Check if user is authenticated and is an admin
		if (!session || !session.user || session.user.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const promoCodes = await prisma.promoCode.findMany({
			orderBy: {
				createdAt: "desc",
			},
			include: {
				orders: {
					select: {
						id: true,
						orderId: true,
						discountAmount: true,
					},
				},
			},
		});

		return NextResponse.json(promoCodes, { status: 200 });
	} catch (error) {
		console.error("Error fetching promo codes:", error);
		return NextResponse.json({ error: "Failed to fetch promo codes" }, { status: 500 });
	}
}

// POST - Create new promo code
export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		// Check if user is authenticated and is an admin
		if (!session || !session.user || session.user.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { code, type, value, maxUses, expiresAt, description, isActive, autoGenerate } = body;

		// Validate required fields
		if (!type || value === undefined || value === null) {
			return NextResponse.json({ error: "Type and value are required" }, { status: 400 });
		}

		// Generate or use provided code
		let promoCode = code?.toUpperCase();
		if (autoGenerate || !promoCode) {
			promoCode = generatePromoCode(10);

			// Ensure the generated code is unique
			let attempts = 0;
			while (attempts < 10) {
				const existing = await prisma.promoCode.findUnique({
					where: { code: promoCode },
				});

				if (!existing) {
					break;
				}

				promoCode = generatePromoCode(10);
				attempts++;
			}

			if (attempts === 10) {
				return NextResponse.json({ error: "Failed to generate unique promo code" }, { status: 500 });
			}
		} else {
			// Check if custom code already exists
			const existing = await prisma.promoCode.findUnique({
				where: { code: promoCode },
			});

			if (existing) {
				return NextResponse.json({ error: "Promo code already exists" }, { status: 409 });
			}
		}

		// Create the promo code
		const newPromoCode = await prisma.promoCode.create({
			data: {
				code: promoCode,
				type,
				value,
				maxUses: maxUses || null,
				expiresAt: expiresAt ? new Date(expiresAt) : null,
				description: description || null,
				isActive: isActive !== undefined ? isActive : true,
				createdBy: session.user.id,
			},
		});

		return NextResponse.json(newPromoCode, { status: 201 });
	} catch (error) {
		console.error("Error creating promo code:", error);
		return NextResponse.json({ error: "Failed to create promo code" }, { status: 500 });
	}
}

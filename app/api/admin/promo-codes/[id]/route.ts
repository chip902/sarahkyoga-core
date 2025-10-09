// app/api/admin/promo-codes/[id]/route.ts

import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PATCH - Update promo code
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const session = await getServerSession(authOptions);

		// Check if user is authenticated and is an admin
		if (!session || !session.user || session.user.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;
		const body = await request.json();
		const { type, value, maxUses, expiresAt, description, isActive } = body;

		// Check if promo code exists
		const existingPromoCode = await prisma.promoCode.findUnique({
			where: { id },
		});

		if (!existingPromoCode) {
			return NextResponse.json({ error: "Promo code not found" }, { status: 404 });
		}

		// Update promo code
		const updatedPromoCode = await prisma.promoCode.update({
			where: { id },
			data: {
				...(type && { type }),
				...(value !== undefined && { value }),
				...(maxUses !== undefined && { maxUses }),
				...(expiresAt !== undefined && { expiresAt: expiresAt ? new Date(expiresAt) : null }),
				...(description !== undefined && { description }),
				...(isActive !== undefined && { isActive }),
			},
		});

		return NextResponse.json(updatedPromoCode, { status: 200 });
	} catch (error) {
		console.error("Error updating promo code:", error);
		return NextResponse.json({ error: "Failed to update promo code" }, { status: 500 });
	}
}

// DELETE - Delete promo code
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const session = await getServerSession(authOptions);

		// Check if user is authenticated and is an admin
		if (!session || !session.user || session.user.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;

		// Check if promo code exists
		const existingPromoCode = await prisma.promoCode.findUnique({
			where: { id },
			include: {
				orders: true,
			},
		});

		if (!existingPromoCode) {
			return NextResponse.json({ error: "Promo code not found" }, { status: 404 });
		}

		// Check if promo code has been used
		if (existingPromoCode.orders.length > 0) {
			return NextResponse.json(
				{
					error: "Cannot delete promo code that has been used. Consider deactivating it instead.",
				},
				{ status: 400 }
			);
		}

		// Delete promo code
		await prisma.promoCode.delete({
			where: { id },
		});

		return NextResponse.json({ message: "Promo code deleted successfully" }, { status: 200 });
	} catch (error) {
		console.error("Error deleting promo code:", error);
		return NextResponse.json({ error: "Failed to delete promo code" }, { status: 500 });
	}
}

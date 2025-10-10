// app/api/admin/users/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

// PATCH - Update user (admin only)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const session = await getServerSession(authOptions);

		// Check if user is authenticated and is an admin
		if (!session || !session.user || session.user.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;
		const body = await request.json();

		// Validation schema - all fields optional for updates
		const schema = z.object({
			email: z.string().email("Invalid email address").optional(),
			firstName: z.string().min(1, "First name cannot be empty").optional(),
			lastName: z.string().min(1, "Last name cannot be empty").optional(),
			role: z.enum(["user", "admin"]).optional(),
		});

		const validation = schema.safeParse(body);
		if (!validation.success) {
			return NextResponse.json(
				{ error: "Validation failed", details: validation.error.errors },
				{ status: 400 }
			);
		}

		// Check if user exists
		const existingUser = await prisma.user.findUnique({
			where: { id },
		});

		if (!existingUser) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// If email is being changed, check if new email already exists
		if (body.email && body.email.toLowerCase() !== existingUser.email) {
			const emailInUse = await prisma.user.findUnique({
				where: { email: body.email.toLowerCase() },
			});

			if (emailInUse) {
				return NextResponse.json({ error: "Email already in use" }, { status: 409 });
			}
		}

		// Prevent admin from demoting themselves
		if (existingUser.id === session.user.id && body.role === "user") {
			return NextResponse.json({ error: "You cannot demote yourself from admin" }, { status: 403 });
		}

		// Update the user
		const updatedUser = await prisma.user.update({
			where: { id },
			data: {
				...(body.email && { email: body.email.toLowerCase() }),
				...(body.firstName && { firstName: body.firstName }),
				...(body.lastName && { lastName: body.lastName }),
				...(body.role && { role: body.role }),
			},
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
				role: true,
				type: true,
			},
		});

		return NextResponse.json(updatedUser, { status: 200 });
	} catch (error) {
		console.error("Error updating user:", error);
		return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
	}
}

// DELETE - Delete user (admin only)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const session = await getServerSession(authOptions);

		// Check if user is authenticated and is an admin
		if (!session || !session.user || session.user.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;

		// Check if user exists
		const userToDelete = await prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				email: true,
				role: true,
			},
		});

		if (!userToDelete) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Prevent admin from deleting themselves
		if (userToDelete.id === session.user.id) {
			return NextResponse.json({ error: "You cannot delete yourself" }, { status: 403 });
		}

		// Prevent deletion of the last admin
		if (userToDelete.role === "admin") {
			const adminCount = await prisma.user.count({
				where: { role: "admin" },
			});

			if (adminCount <= 1) {
				return NextResponse.json(
					{ error: "Cannot delete the last admin user" },
					{ status: 403 }
				);
			}
		}

		// Delete the user (Prisma will cascade delete related records)
		await prisma.user.delete({
			where: { id },
		});

		return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
	} catch (error) {
		console.error("Error deleting user:", error);
		return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
	}
}

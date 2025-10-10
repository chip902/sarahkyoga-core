/**
 * DEPRECATED: These routes are deprecated in favor of /api/admin/users/[id]
 * These routes now require admin authentication for security.
 * Use /api/admin/users/[id] instead for user management.
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		// Require admin authentication
		if (!session || !session.user || session.user.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
		}

		const body = await request.json();
		const id = request.nextUrl.pathname.split("/").pop();

		const updatedUser = await prisma.user.update({
			where: { id: id },
			data: { ...body },
		});
		return NextResponse.json(updatedUser);
	} catch (error) {
		console.error(error);
		return new NextResponse("Error updating user", { status: 500 });
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions);

		// Require admin authentication
		if (!session || !session.user || session.user.role !== "admin") {
			return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
		}

		const body = await request.json();
		const id = request.nextUrl.pathname.split("/").pop();

		await prisma.user.delete({ where: { id: id } });
		return new NextResponse("User deleted", { status: 204 });
	} catch (error) {
		console.error(error);
		return new NextResponse("Error deleting user", { status: 500 });
	}
}

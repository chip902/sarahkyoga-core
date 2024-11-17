// app/api/users/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function PUT(request: NextRequest) {
	const body = await request.json();
	const id = request.nextUrl.pathname.split("/").pop();

	try {
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
	const body = await request.json();
	const id = request.nextUrl.pathname.split("/").pop();
	try {
		await prisma.user.delete({ where: { id: id } });
		return new NextResponse("User deleted", { status: 204 });
	} catch (error) {
		console.error(error);
		return new NextResponse("Error deleting user", { status: 500 });
	}
}

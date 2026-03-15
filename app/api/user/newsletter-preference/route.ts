import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/prisma/client";
import { authOptions } from "@/lib/auth";

export async function PATCH(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { newsletterOptIn } = await request.json();

		if (typeof newsletterOptIn !== "boolean") {
			return NextResponse.json(
				{ error: "newsletterOptIn must be a boolean" },
				{ status: 400 }
			);
		}

		await prisma.user.update({
			where: { id: session.user.id },
			data: { newsletterOptIn },
		});

		return NextResponse.json({
			success: true,
			newsletterOptIn,
		});
	} catch (error) {
		console.error("Error updating newsletter preference:", error);
		return NextResponse.json(
			{ error: "Failed to update preference" },
			{ status: 500 }
		);
	}
}

export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: { newsletterOptIn: true },
		});

		return NextResponse.json({
			newsletterOptIn: user?.newsletterOptIn ?? false,
		});
	} catch (error) {
		console.error("Error fetching newsletter preference:", error);
		return NextResponse.json(
			{ error: "Failed to fetch preference" },
			{ status: 500 }
		);
	}
}

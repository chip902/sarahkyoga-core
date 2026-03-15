import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import path from "path";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
	const contentType = request.headers.get("content-type") || "";

	if (!contentType.includes("multipart/form-data")) {
		return NextResponse.json({ error: "Unsupported Media Type" }, { status: 415 });
	}

	const formData = await request.formData();
	const file = formData.get("image") as File;

	if (!file) {
		return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
	}

	const ext = path.extname(file.name) || ".png";
	const filename = `newsletter/${randomUUID()}${ext}`;

	try {
		const blob = await put(filename, file, {
			access: "public",
			contentType: file.type,
		});

		return NextResponse.json({ url: blob.url });
	} catch (err) {
		console.error("Error uploading to Vercel Blob:", err);
		return NextResponse.json({ error: "Error uploading file" }, { status: 500 });
	}
}

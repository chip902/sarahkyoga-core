import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { randomUUID } from "crypto";
import fs from "fs";

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

	const tempFilename = randomUUID() + path.extname(file.name);
	const uploadDir = path.join(process.cwd(), "public", "uploads");

	// Ensure the uploads directory exists
	try {
		await fs.promises.mkdir(uploadDir, { recursive: true });
	} catch (err) {
		console.error(err);
	}

	const filePath = path.join(uploadDir, tempFilename);

	// Save the file
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	try {
		await fs.promises.writeFile(filePath, buffer);
		const imageUrl = `/uploads/${tempFilename}`;
		return NextResponse.json({ url: imageUrl });
	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: "Error uploading file" }, { status: 500 });
	}
}

// prisma/seed-class-pass.ts
// Script to seed the database with a Class Pass product and its variants

import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient();

async function main() {
	console.log("Seeding class pass product with variants...");

	// Create the Class Pass product
	const classPass = await prisma.product.upsert({
		where: { id: "class-pass-main" }, // Using a fixed ID for idempotency
		update: {}, // Don't update if exists
		create: {
			id: "class-pass-main",
			name: "Class Pass",
			description:
				"Purchase a class pass for multiple sessions. Save money when you buy more classes! " +
				"Class passes are perfect for regular practitioners and never expire. Use them at your own pace.",
			price: 0, // Base price - variants will have their own prices
			type: "CLASS_PASS",
			duration: null,
			availableSlots: null,
			imageUrl: null,
		},
	});

	console.log("Created Class Pass product:", classPass.id);

	// Create variants for 5, 10, and 20 class passes
	const variants = [
		{
			id: "class-pass-5",
			name: "5 Class Pass",
			price: 75, // $15 per class
			quantity: 5,
		},
		{
			id: "class-pass-10",
			name: "10 Class Pass",
			price: 140, // $14 per class (save $10)
			quantity: 10,
		},
		{
			id: "class-pass-20",
			name: "20 Class Pass",
			price: 260, // $13 per class (save $40)
			quantity: 20,
		},
	];

	for (const variant of variants) {
		const createdVariant = await prisma.productVariant.upsert({
			where: { id: variant.id },
			update: {
				name: variant.name,
				price: variant.price,
				quantity: variant.quantity,
			},
			create: {
				id: variant.id,
				productId: classPass.id,
				name: variant.name,
				price: variant.price,
				quantity: variant.quantity,
			},
		});

		console.log(`Created variant: ${createdVariant.name} - $${createdVariant.price} (${createdVariant.quantity} classes)`);
	}

	console.log("Seeding completed successfully!");
}

main()
	.catch((e) => {
		console.error("Error seeding database:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

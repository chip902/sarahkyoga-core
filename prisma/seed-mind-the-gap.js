import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient();

const WORKSHOP_NAME = "Mind The Gap: Finding Your Rib-Pelvis Stack";

async function main() {
	const existing = await prisma.product.findFirst({
		where: { name: WORKSHOP_NAME },
	});

	const productData = {
		name: WORKSHOP_NAME,
		description:
			"In this 90-minute workshop Sarah & Melissa will explore the concept of the stack, the dynamic relationship between the rib cage and pelvis. Participants will learn how alignment between these two structures influences breathing, core engagement, posture, and performance.",
		price: 50,
		type: "WORKSHOP",
		duration: 90,
		availableSlots: 999,
		imageUrl: null,
	};

	if (existing) {
		const updated = await prisma.product.update({
			where: { id: existing.id },
			data: productData,
		});

		console.log("Updated workshop product with id:", updated.id);
		return;
	}

	const created = await prisma.product.create({
		data: productData,
	});

	console.log("Created workshop product with id:", created.id);
}

main()
	.catch((error) => {
		console.error(error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

// seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
	await prisma.$connect();
	await prisma.product.createMany({
		data: [
			{
				id: "0",
				name: "Interactive Zoom Yoga Practice",
				description:
					"For this 60-minute practice, expect to get a blend of workshop and flow. You can anticipate multiple movement modalities including vinyasa, functional mobility, and Katonah Yoga®. While this class is geared towards students with a well-developed practice, this interactive practice is welcome to all students who are looking for a more integrated approach to asana practice.",
				price: 60.0,
				duration: 60,
				availableSlots: 999,
			},
			{
				id: "1",
				name: "60-Min Private Zoom Session",
				description:
					"Get a personalized 60-minute Zoom practice. This 60 minute exercise is designed for individuals who are interested in developing self-reliance or who want to improve their flexibility and strength. ",
				price: 80.0,
				duration: 60,
				availableSlots: 999,
			},
			{
				id: "2",
				name: "75-Min In Person Practice (1-2 People)",
				description: "Enjoy a private 75-minute in-person private practice.",
				price: 125.0,
				duration: 75,
				availableSlots: 999,
			},
			{
				id: "3",
				name: "75-Min In-Person (3+ People)",
				description: "Enjoy a private 75-minute in-person private practice as a group of 3 or more!",
				price: 175.0,
				duration: 75,
				availableSlots: 999,
			},
		],
	});
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

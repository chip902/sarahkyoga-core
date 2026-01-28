import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const name = "Katonah Yoga® Extended Practice – March 1";

  // If product already exists, don't create a duplicate
  const existing = await prisma.product.findFirst({ where: { name } });
  if (existing) {
    console.log("Product already exists with id:", existing.id);
    return;
  }

  const description =
    "Katonah Yoga® is a rich theory developed by Nevine Michaan and her teachers. " +
    "It incorporates Hatha yoga, Taoist theory and sacred geometry. We use metaphor, props " +
    "and hands-on adjustments to not only explore the shapes we look to embody through asana, but " +
    "to recognize habits, patterns and blind spots that we all have. For this extended practice, " +
    "we use the metaphor of the body as a house and how we use practice to clean it up and organize it. " +
    "Katonah Yoga is organized around three principles of esoteric dialogue: all polarities are mediated " +
    "by trinity; the universe has pattern, pattern belies intelligence; by virtue of repetition there is " +
    "potential for insight.";

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: 45,
      type: "WORKSHOP",
      duration: 120,
      availableSlots: 999,
      imageUrl: null,
    },
  });

  console.log("Created Extended Practice product with id:", product.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

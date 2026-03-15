import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma";
import { randomUUID } from "crypto";

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_PRISMA_URL ?? "",
});

const prisma = new PrismaClient({ adapter });

const emailsToAdd = [
	"andrew@chip-hosting.com",
	"amandagrei@gmail.com",
	"amie_rchrd@yahoo.com",
	"amygwenwallin@gmail.com",
	"amywallin@msn.com",
	"andrew.chepurny@gmail.com",
	"andrew@chepurny.com",
	"awebster002@maine.rr.com",
	"bagray25@gmail.com",
	"bcanner@gmail.com",
	"betsygarrett@posteo.net",
	"cjleffingwell@gmail.com",
	"clampelmd@att.net",
	"cmcstebbins@gmail.com",
	"coffeypatricia1@gmail.com",
	"d.truslow@comcast.net",
	"dianewebster123@gmail.com",
	"ebrooks@brooklyn.cuny",
	"ebrooks@brooklyn.cuny.edu",
	"ellenhlynch@gmail.com",
	"emilyc.williams66@gmail.com",
	"ericajane1970@gmail.com",
	"erinepreston@me.com",
	"esarson1@gmail.com",
	"icovittinh@icloud.com",
	"info@koanwellness.com",
	"info@yogaeastyoga.com",
	"itterli@bluewin.ch",
	"jeanders07@gmail.com",
	"jennifer.carney08@gmail.com",
	"jnb821@rcn.com",
	"justasknora@icloud.com",
	"kate.kolios.08@gmail.com",
	"katrinkasper@icloud.com",
	"kayla.m.doyle@gmail.com",
	"kchouse@gmail.com",
	"kiafolla@yahoo.com",
	"kmwelch2018@gmail.com",
	"kulevska7@gmail.com",
	"leslielatimer@comcast.net",
	"luvn2ski@gmail.com",
	"m.bitterli@bluewin.ch",
	"mallorynbuck@gmail.com",
	"maryanna1966@gmail.com",
	"mbutler7@mgb.org",
	"melissa.lashure@gmail.com",
	"michellelranieri@gmail.com",
	"nicole.lampel@yahoo.com",
	"olivialoy@gmail.com",
	"padeschenes@comcast.net",
	"renee_sarett@hotmail.com",
	"rjcim005@gmail.com",
	"rusify@hotmail.com",
	"sadoskik11@gmail.com",
	"sarah.ickes@gmail.com",
	"sarah@sarahkyoga.com",
	"sarahekrzyzanowski@gmail.com",
	"sarahwalsh1018@gmail.com",
	"sarsonmedia@gmail.com",
	"sboylec@comcast.net",
	"stevekrzyz@gmail.com",
	"tamar@innertruthmassage.com",
	"tishacasale27@outlook.com",
	"travisjglennon@gmail.com",
	"tterli@bluewin.ch",
	"websterandrew877@gmail.com",
];

async function addSubscribers() {
	console.log("Adding subscribers to the database...");

	try {
		for (const email of emailsToAdd) {
			const existingSubscriber = await prisma.subscriber.findUnique({
				where: { email },
			});

			const existingUser = await prisma.user.findUnique({
				where: { email },
			});

			if (existingSubscriber) {
				const updates: Record<string, unknown> = {};

				if (!existingSubscriber.active) {
					updates.active = true;
					console.log(`  Reactivated ${email}`);
				}

				if (!existingSubscriber.unsubscribeToken) {
					updates.unsubscribeToken = randomUUID();
					console.log(`  Generated unsubscribe token for ${email}`);
				}

				if (Object.keys(updates).length > 0) {
					await prisma.subscriber.update({
						where: { email },
						data: updates,
					});
				} else {
					console.log(`Already subscribed: ${email}`);
				}
				continue;
			}

			if (existingUser?.newsletterOptIn) {
				console.log(`Already subscribed as registered user: ${email}`);
				continue;
			}

			await prisma.subscriber.create({
				data: {
					email,
					active: true,
					unsubscribeToken: randomUUID(),
				},
			});

			console.log(`Added ${email}`);
		}

		// Backfill tokens for any existing subscribers missing one
		const subscribersWithoutToken = await prisma.subscriber.findMany({
			where: { unsubscribeToken: null },
		});

		for (const sub of subscribersWithoutToken) {
			await prisma.subscriber.update({
				where: { id: sub.id },
				data: { unsubscribeToken: randomUUID() },
			});
			console.log(`  Backfilled token for ${sub.email}`);
		}

		console.log("\nDone adding subscribers!");

		const totalSubscribers = await prisma.subscriber.count({
			where: { active: true },
		});
		console.log(`Total active subscribers: ${totalSubscribers}`);
	} catch (error) {
		console.error("Error:", error);
	} finally {
		await prisma.$disconnect();
	}
}

addSubscribers();

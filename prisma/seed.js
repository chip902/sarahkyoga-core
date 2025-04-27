// seed.js
import { PrismaClient } from "../app/generated/prisma";

async function main() {
	const prisma = new PrismaClient();
	await prisma.$connect();
	await prisma.subscriber.createMany({
		data: [
			{
				id: "2",
				email: "justasknora@icloud.com",
			},
			{
				id: "3",
				email: "kate.kolios.08@gmail.com",
			},
			{
				id: "4",
				email: "Padeschenes@comcast.net",
			},
			{
				id: "5",
				email: "Katrinkasper@icloud.com",
			},
			{
				id: "6",
				email: "tamar@innertruthmassage.com",
			},
			{
				id: "7",
				email: "websterandrew877@gmail.com",
			},
			{
				id: "8",
				email: "andrew@chepurny.com",
			},
			{
				id: "9",
				email: "sboylec@comcast.net",
			},
			{
				id: "10",
				email: "bcanner@gmail.com",
			},
			{
				id: "11",
				email: "Kmwelch2018@gmail.com",
			},
			{
				id: "12",
				email: "itterli@bluewin.ch",
			},
			{
				id: "13",
				email: "awebster002@maine.rr.com",
			},
			{
				id: "14",
				email: "jennifer.carney08@gmail.com",
			},
			{
				id: "15",
				email: "bagray25@gmail.com",
			},
			{
				id: "16",
				email: "nicole.lampel@yahoo.com",
			},
			{
				id: "17",
				email: "rjcim005@gmail.com",
			},
			{
				id: "18",
				email: "jnb821@rcn.com",
			},
			{
				id: "19",
				email: "ebrooks@brooklyn.cuny.edu",
			},
			{
				id: "20",
				email: "maryanna1966@gmail.com",
			},
			{
				id: "21",
				email: "sarah.ickes@gmail.com",
			},
			{
				id: "22",
				email: "sarahwalsh1018@gmail.com",
			},
			{
				id: "23",
				email: "ericajane1970@gmail.com",
			},
			{
				id: "24",
				email: "tterli@bluewin.ch",
			},
			{
				id: "25",
				email: "m.bitterli@bluewin.ch",
			},
			{
				id: "26",
				email: "jeanders07@gmail.com",
			},
			{
				id: "27",
				email: "esarson1@gmail.com",
			},
			{
				id: "28",
				email: "test@test.com",
			},
			{
				id: "29",
				email: "kayla.m.doyle@gmail.com",
			},
			{
				id: "30",
				email: "sarahekrzyzanowski@gmail.com",
			},
			{
				id: "31",
				email: "jeanders07@gmail.con",
			},
			{
				id: "32",
				email: "michellelranieri@gmail.com",
			},
			{
				id: "33",
				email: "clamoelmd@att.net",
			},
			{
				id: "34",
				email: "renee_sarett@hotmail.com",
			},
			{
				id: "35",
				email: "andrew.chepurny@gmail.com",
			},
			{
				id: "36",
				email: "clampelmd@att.net",
			},
			{
				id: "37",
				email: "stevekrzyz@gmail.com",
			},
			{
				id: "38",
				email: "sarsonmedia@gmail.com",
			},
			{
				id: "39",
				email: "info@yogaeastyoga.com",
			},
			{
				id: "40",
				email: "luvn2ski@gmail.com",
			},
			{
				id: "41",
				email: "esarson1@hmail.com",
			},
			{
				id: "42",
				email: "info@koanwellness.com",
			},
			{
				id: "43",
				email: "amygwenwallin@gmail.com",
			},
			{
				id: "44",
				email: "ebrooks@brooklyn.cuny",
			},
			{
				id: "45",
				email: "amandagrei@gmail.com",
			},
			{
				id: "46",
				email: "amywallin@msn.com",
			},
			{
				id: "47",
				email: "rusify@hotmail.com",
			},
			{
				id: "48",
				email: "dianewebster123@gmail.com",
			},
		],
	});
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
// .finally(async () => {
// 	await prisma!.$disconnect();
// });

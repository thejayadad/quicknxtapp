// prisma/seed.ts
import { randomUUID } from "node:crypto";
import { PrismaClient, Visibility, PriceType } from "@prisma/client";

const prisma = new PrismaClient();
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];

async function main() {
  console.log("🚀 Seeding database...");

  // Optional: Clear existing data for dev/testing
  await prisma.track.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  console.log("🧹 Cleared tables");

  // --- 1. Create users ---
  const users = await Promise.all(
    [
      { name: "Jay", email: "jay@example.com" },
      { name: "Ava", email: "ava@example.com" },
      { name: "Max", email: "max@example.com" },
    ].map((u) =>
      prisma.user.create({
        data: {
          id: randomUUID(),
          name: u.name,
          email: u.email,
          emailVerified: true,
          image: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
    )
  );

  console.log(`✅ Created ${users.length} users`);

  // --- 2. Define seed data pools ---
  const audioPool = ["/audio/demo1.wav", "/audio/demo2.wav", "/audio/demo3.wav"] as const;
  const imagePool = ["/images/pic1.png", "/images/pic2.png", "/images/pic3.png", "/images/pic4.png"] as const;
  const tagPool = [
    ["chill", "lofi"],
    ["hiphop", "beat"],
    ["edm", "synth"],
    ["ambient"],
    ["acoustic", "guitar"],
    ["trap", "808"],
    ["house", "bass"],
  ] as const;
  const keyPool = ["C", "Dm", "G", "Am", "F", "E", "Bm", "A"];

  const visibilityOptions: Visibility[] = [
    Visibility.PUBLIC,
    Visibility.UNLISTED,
    Visibility.PRIVATE,
  ];

  // --- 3. Generate 10 demo tracks ---
  const makeTrack = (i: number) => {
    const owner = pick(users);
    const paid = i % 4 === 0; // 1/4 of tracks are paid
    const priceType = paid ? PriceType.PAID : PriceType.FREE;
    const priceCents = paid ? [199, 299, 499][i % 3] : null;

    return {
      id: randomUUID(),
      title: `Demo Track ${i}`,
      description: `This is a seeded demo track #${i} — used for testing CRUD and UI display.`,
      owner: { connect: { id: owner.id } },
      audioUrl: pick(audioPool),
      imageUrl: pick(imagePool),
      tags: [...pick(tagPool)],
      key: pick(keyPool),
      visibility: pick(visibilityOptions),
      priceType,
      priceCents,
      createdAt: new Date(),
    };
  };

  const trackData = Array.from({ length: 10 }, (_, i) => makeTrack(i + 1));

  await prisma.$transaction(trackData.map((data) => prisma.track.create({ data })));

  console.log(`🎵 Created ${trackData.length} demo tracks`);
  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

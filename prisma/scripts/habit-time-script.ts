import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function main() {
  const habits = await prisma.habit.findMany({
    select: {
      id: true,
      time: true,
    },
  });

  for await (const habit of habits) {
    if (habit.time) {
      await prisma.habit.update({
        where: {
          id: habit.id,
        },
        data: {
          time: habit.time.substring(0, 5),
        },
      });
    }
  }
}

main();

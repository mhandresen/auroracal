import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, TenantRole } from '@prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, tenantId: true },
  });

  for (const user of users) {
    await prisma.tenantMember.upsert({
      where: { tenantId_userId: { tenantId: user.tenantId, userId: user.id } },
      update: {},
      create: {
        tenantId: user.tenantId,
        userId: user.id,
        role: TenantRole.OWNER,
      },
    });

    console.log(`Backfilled ${users.length} user into TenantMember`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

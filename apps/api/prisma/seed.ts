import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      slug: 'demo',
      name: 'Demo Tenant',
    },
  });
  await prisma.tenant.upsert({
    where: { slug: 'acme' },
    update: {},
    create: {
      slug: 'acme',
      name: 'acme Tenant',
    },
  });

  const user = await prisma.user.upsert({
    where: {
      tenantId_email: { tenantId: tenant.id, email: 'martin@localhost' },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'martin@localhost',
      name: 'Martin',
      slug: 'martin',
      timezone: 'Europe/Oslo',
    },
  });

  const meetingType = await prisma.meetingType.upsert({
    where: {
      userId_slug: { userId: user.id, slug: '30min' },
    },
    update: {},
    create: {
      userId: user.id,
      slug: '30min',
      name: '30 min call',
      durationMinutes: 30,
      locationType: 'manual',
      locationValue: 'https://meet.example.com/martin',
    },
  });

  const rules = [
    { dayOfWeek: 1, startMinute: 9 * 60, endMinute: 16 * 60 },
    { dayOfWeek: 2, startMinute: 9 * 60, endMinute: 16 * 60 },
    { dayOfWeek: 3, startMinute: 9 * 60, endMinute: 16 * 60 },
    { dayOfWeek: 4, startMinute: 9 * 60, endMinute: 16 * 60 },
    { dayOfWeek: 5, startMinute: 9 * 60, endMinute: 16 * 60 },
  ];

  await prisma.availabilityRule.deleteMany({ where: { userId: user.id } });
  await prisma.availabilityRule.createMany({
    data: rules.map((r) => ({ ...r, userId: user.id })),
  });

  console.log({
    tenant: { id: tenant.id, slug: tenant.slug },
    user: { id: user.id, slug: user.slug },
    meetingType: { id: meetingType.id, slug: meetingType.slug },
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

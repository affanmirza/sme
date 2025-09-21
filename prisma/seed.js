const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: process.env.ADMIN_EMAIL }
  });

  if (existingAdmin) {
    console.log('✅ Admin user already exists, skipping seed');
    return;
  }

  // Create admin user (no password needed since auth is disabled)
  const admin = await prisma.user.create({
    data: {
      email: process.env.ADMIN_EMAIL,
      passwordHash: 'no-password-needed', // Dummy value since auth is disabled
      role: 'ADMIN'
    }
  });

  console.log('✅ Admin user created:', admin.email);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

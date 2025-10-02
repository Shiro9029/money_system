// Test database connection to Neon
const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔌 Testing database connection...');
    
    // Test basic connection
    await prisma.$queryRaw`SELECT version()`;
    console.log('✅ Database connection successful!');
    
    // Test table access
    const categoryCount = await prisma.category.count();
    console.log(`📊 Categories in database: ${categoryCount}`);
    
    const transactionCount = await prisma.transaction.count();
    console.log(`💰 Transactions in database: ${transactionCount}`);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
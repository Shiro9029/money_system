import { PrismaClient, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // カテゴリのシードデータ
  const categories = [
    { name: '給与', type: TransactionType.INCOME, color: '#4caf50' },
    { name: '副収入', type: TransactionType.INCOME, color: '#8bc34a' },
    { name: '投資収入', type: TransactionType.INCOME, color: '#2e7d32' },
    { name: '食費', type: TransactionType.EXPENSE, color: '#f44336' },
    { name: '交通費', type: TransactionType.EXPENSE, color: '#ff9800' },
    { name: '住居費', type: TransactionType.EXPENSE, color: '#e91e63' },
    { name: '光熱費', type: TransactionType.EXPENSE, color: '#9c27b0' },
    { name: '通信費', type: TransactionType.EXPENSE, color: '#673ab7' },
    { name: '娯楽費', type: TransactionType.EXPENSE, color: '#3f51b5' },
    { name: '医療費', type: TransactionType.EXPENSE, color: '#009688' },
  ];

  console.log('Start seeding...');

  // カテゴリを作成
  for (const categoryData of categories) {
    const category = await prisma.category.upsert({
      where: { name: categoryData.name },
      update: {},
      create: categoryData,
    });
    console.log(`Created category: ${category.name}`);
  }

  // サンプル取引データ
  const salary = await prisma.category.findUnique({ where: { name: '給与' } });
  const food = await prisma.category.findUnique({ where: { name: '食費' } });
  const transport = await prisma.category.findUnique({ where: { name: '交通費' } });

  if (salary && food && transport) {
    const transactions = [
      {
        date: new Date('2024-01-15'),
        description: '月給',
        amount: 300000,
        type: TransactionType.INCOME,
        tags: ['毎月', '固定収入'],
        categoryId: salary.id,
      },
      {
        date: new Date('2024-01-16'),
        description: 'スーパーでの買い物',
        amount: 3500,
        type: TransactionType.EXPENSE,
        tags: ['日用品', '食材'],
        categoryId: food.id,
      },
      {
        date: new Date('2024-01-17'),
        description: '電車定期券',
        amount: 12000,
        type: TransactionType.EXPENSE,
        tags: ['通勤', '定期'],
        categoryId: transport.id,
      },
    ];

    for (const transactionData of transactions) {
      const transaction = await prisma.transaction.create({
        data: transactionData,
      });
      console.log(`Created transaction: ${transaction.description}`);
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
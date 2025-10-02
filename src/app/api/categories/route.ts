import { NextResponse } from 'next/server';
import { TransactionType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { ICategory } from '@/types';

// Prismaのカテゴリタイプをアプリケーションのタイプに変換
function convertPrismaCategory(prismaCategory: any): ICategory {
  return {
    id: prismaCategory.id,
    name: prismaCategory.name,
    type: prismaCategory.type === TransactionType.INCOME ? 'income' : 'expense',
    color: prismaCategory.color,
  };
}

export async function GET() {
  try {
    const prismaCategories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    const categories = prismaCategories.map(convertPrismaCategory);

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
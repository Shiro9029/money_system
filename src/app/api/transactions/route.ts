import { NextRequest, NextResponse } from 'next/server';
import { TransactionType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { ITransaction } from '@/types';

// Prismaのトランザクションタイプをアプリケーションのタイプに変換
function convertPrismaTransaction(prismaTransaction: any): ITransaction {
  return {
    id: prismaTransaction.id,
    date: prismaTransaction.date.toISOString().split('T')[0],
    description: prismaTransaction.description,
    category: prismaTransaction.category.name,
    amount: parseFloat(prismaTransaction.amount.toString()),
    type: prismaTransaction.type === TransactionType.INCOME ? 'income' : 'expense',
    tags: prismaTransaction.tags || [],
  };
}

export async function GET() {
  try {
    const prismaTransactions = await prisma.transaction.findMany({
      include: {
        category: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    const transactions = prismaTransactions.map(convertPrismaTransaction);

    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // バリデーション
    if (!body.date || !body.description || !body.category || !body.amount || !body.type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (typeof body.amount !== 'number' || body.amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    if (!['income', 'expense'].includes(body.type)) {
      return NextResponse.json(
        { error: 'Type must be either income or expense' },
        { status: 400 }
      );
    }

    // カテゴリが存在するかチェック
    const category = await prisma.category.findUnique({
      where: { name: body.category },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 400 }
      );
    }

    // トランザクションを作成
    const prismaTransaction = await prisma.transaction.create({
      data: {
        date: new Date(body.date),
        description: body.description.trim(),
        amount: body.amount,
        type: body.type === 'income' ? TransactionType.INCOME : TransactionType.EXPENSE,
        tags: body.tags || [],
        categoryId: category.id,
      },
      include: {
        category: true,
      },
    });

    const newTransaction = convertPrismaTransaction(prismaTransaction);

    return NextResponse.json(
      { transaction: newTransaction, message: 'Transaction created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
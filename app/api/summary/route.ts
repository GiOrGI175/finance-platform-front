import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import { subDays, parseISO, differenceInDays } from 'date-fns';
import Transactions from '@/lib/model/transactions';
import Account from '@/lib/model/Account';
import mongoose from 'mongoose';

interface DecodedToken {
  id: string;
}

export async function GET(req: Request) {
  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get('token')?.value;

    console.log('🍪 All cookies:', cookiesStore.getAll());
    console.log('🔑 Token:', token);
    console.log('📍 Request URL:', req.url);

    if (!token)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    if (!decoded?.id) {
      return NextResponse.json(
        { message: 'Invalid token payload' },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const accountId = searchParams.get('accountId');

    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo, 30);

    const startDate = from ? parseISO(from) : defaultFrom;
    const endDate = to ? parseISO(to) : defaultTo;

    const periodLength = differenceInDays(endDate, startDate) + 1;
    const lastPeriodStart = subDays(startDate, periodLength);
    const lastPeriodEnd = subDays(endDate, periodLength);

    async function fetchFinancialData(
      userId: string,
      startDate: Date,
      endDate: Date,
      accountId?: string
    ) {
      const userAccounts = await Account.find({ userId }).select('_id');
      const userAccountIds = userAccounts.map((a) => a._id.toString());

      console.log('User ID:', userId);
      console.log('User Accounts:', userAccountIds);

      if (userAccountIds.length === 0) {
        console.log('No accounts found for user');
        return { income: 0, expenses: 0, remaining: 0 };
      }

      const accountObjectIds = userAccounts.map((a) => a._id);

      const match: any = {
        accountId: accountId
          ? new mongoose.Types.ObjectId(accountId)
          : { $in: accountObjectIds },
        date: { $gte: startDate, $lte: endDate },
      };

      console.log('Match query:', JSON.stringify(match, null, 2));

      const transactionCount = await Transactions.countDocuments(match);
      console.log('Transactions found:', transactionCount);

      const [summary] = await Transactions.aggregate([
        { $match: match },
        {
          $addFields: {
            amountNumber: {
              $convert: {
                input: '$amount',
                to: 'double',
                onError: 0,
                onNull: 0,
              },
            },
          },
        },
        {
          $group: {
            _id: null,
            income: {
              $sum: {
                $cond: [{ $gte: ['$amountNumber', 0] }, '$amountNumber', 0],
              },
            },
            expenses: {
              $sum: {
                $cond: [{ $lt: ['$amountNumber', 0] }, '$amountNumber', 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            income: 1,
            expenses: { $abs: '$expenses' },
            remaining: { $subtract: ['$income', { $abs: '$expenses' }] },
          },
        },
      ]);

      console.log('Summary result:', summary);

      return summary || { income: 0, expenses: 0, remaining: 0 };
    }

    const currentPeriod = await fetchFinancialData(
      decoded.id,
      startDate,
      endDate,
      accountId || undefined
    );

    const lastPeriod = await fetchFinancialData(
      decoded.id,
      lastPeriodStart,
      lastPeriodEnd,
      accountId || undefined
    );

    return NextResponse.json({ currentPeriod, lastPeriod });
  } catch (error) {
    console.error('Summary API error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
}

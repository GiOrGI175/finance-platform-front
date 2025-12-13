import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import { subDays, parseISO, differenceInDays } from 'date-fns';
import Transactions from '@/lib/model/transactions';
import Account from '@/lib/model/Account';
import mongoose from 'mongoose';
import { calculatePerecentageChange, fillMissingDays } from '@/lib/utils';

interface DecodedToken {
  id: string;
}

export async function GET(req: Request) {
  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get('token')?.value;

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

    const incomeChange = calculatePerecentageChange(
      currentPeriod.income,
      lastPeriod.income
    );

    const expensesChange = calculatePerecentageChange(
      currentPeriod.expenses,
      lastPeriod.expenses
    );

    const remainingChange = calculatePerecentageChange(
      currentPeriod.remaining,
      lastPeriod.remaining
    );

    const userAccounts = await Account.find({ userId: decoded.id }).select(
      '_id'
    );
    const accountObjectIds = userAccounts.map((a) => a._id);

    const categoryMatch: any = {
      accountId: accountId
        ? new mongoose.Types.ObjectId(accountId)
        : { $in: accountObjectIds },
      date: { $gte: startDate, $lte: endDate },
    };

    console.log('📊 Category Match:', JSON.stringify(categoryMatch, null, 2));

    const transactionsWithCategory = await Transactions.countDocuments({
      ...categoryMatch,
      categoryId: { $exists: true, $ne: null },
    });
    console.log('📈 Transactions with categoryId:', transactionsWithCategory);

    const categorySummary = await Transactions.aggregate([
      { $match: categoryMatch },
      {
        $match: {
          categoryId: { $exists: true, $ne: null },
        },
      },
      {
        $lookup: {
          from: 'Categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $match: {
          'category.0': { $exists: true },
        },
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category.name',
          value: {
            $sum: {
              $abs: {
                $convert: {
                  input: '$amount',
                  to: 'double',
                  onError: 0,
                  onNull: 0,
                },
              },
            },
          },
        },
      },
      { $sort: { value: -1 } },
    ]);

    console.log('📊 Category Summary:', categorySummary);

    const topCategories = categorySummary.slice(0, 3);
    const otherCategories = categorySummary.slice(3);
    const otherSum = otherCategories.reduce((sum, cur) => sum + cur.value, 0);

    const finalCategories =
      otherCategories.length > 0
        ? [...topCategories, { _id: 'Other', value: otherSum }]
        : topCategories;

    const activeDays = await fetchActiveDays(
      decoded.id,
      startDate,
      endDate,
      accountId || undefined
    );

    const days = fillMissingDays(activeDays, startDate, endDate);

    return NextResponse.json({
      data: {
        remainingAmount: currentPeriod.remaining,
        remainingChange,
        incomeAmount: currentPeriod.income,
        incomeChange,
        expensesAmount: currentPeriod.expenses,
        expensesChange,
        categories: finalCategories,
        days,
      },
    });

    // return NextResponse.json({
    //   currentPeriod,
    //   lastPeriod,
    //   incomeChange,
    //   expensesChange,
    //   remainingChange,
    //   finalCategories,
    //   activeDays,
    //   days,
    // });
  } catch (error) {
    console.error('Summary API error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
}

async function fetchActiveDays(
  userId: string,
  startDate: Date,
  endDate: Date,
  accountId?: string
) {
  const userAccounts = await Account.find({ userId }).select('_id');

  if (userAccounts.length === 0) {
    console.log('No accounts found for activeDays');
    return [];
  }

  const accountIds = userAccounts.map((a) => a._id);

  const match: any = {
    date: { $gte: startDate, $lte: endDate },
    accountId: accountId
      ? new mongoose.Types.ObjectId(accountId)
      : { $in: accountIds },
  };

  console.log('📅 Active Days Match:', JSON.stringify(match, null, 2));

  const activeDays = await Transactions.aggregate([
    { $match: match },
    {
      $addFields: {
        amountNumber: {
          $convert: { input: '$amount', to: 'double', onError: 0, onNull: 0 },
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$date' },
        },
        income: {
          $sum: { $cond: [{ $gte: ['$amountNumber', 0] }, '$amountNumber', 0] },
        },
        expenses: {
          $sum: { $cond: [{ $lt: ['$amountNumber', 0] }, '$amountNumber', 0] },
        },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        date: '$_id',
        income: 1,
        expenses: { $abs: '$expenses' },
      },
    },
  ]);

  console.log('📅 Active Days Result:', activeDays.length, 'days');

  // გარდავქმნათ date string Date ობიექტად fillMissingDays-ისთვის
  return activeDays.map((day) => ({
    date: parseISO(day.date),
    income: day.income,
    expenses: day.expenses,
  }));
}

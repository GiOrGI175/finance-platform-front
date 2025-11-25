import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Transactions from '@/lib/model/transactions';
import jwt from 'jsonwebtoken';
import { transactionSchema } from '@/lib/schema/transactions.shcema';
import { parseISO, subDays } from 'date-fns';
import { cookies } from 'next/headers';

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

    const { searchParams } = new URL(req.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    // const accountId = searchParams.get('accountId');

    await connectDB();

    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo, 30);

    const startDate = from ? parseISO(from) : defaultFrom;
    const endDate = to ? parseISO(to) : defaultTo;

    const query: any = {
      date: { $gte: startDate, $lte: endDate },
    };

    // if (accountId) query.accountId = accountId;
    // else query.accountId = decoded.id;

    const transactions = await Transactions.find(query)
      .populate({
        path: 'accountId',
        select: 'name',
        model: 'Account',
      })
      .populate({
        path: 'categoryId',
        select: 'name',
        model: 'Categories',
      })
      .sort({ date: -1 });

    return NextResponse.json({ transactions });
  } catch (err) {
    console.error('GET error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
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

    const body = await req.json();
    const validated = transactionSchema.parse(body);

    await connectDB();

    const newTx = await Transactions.create({
      ...validated,
    });

    return NextResponse.json({ transaction: newTx }, { status: 201 });
  } catch (err) {
    console.error('POST error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

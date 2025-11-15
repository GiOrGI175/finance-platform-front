import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { transactionSchema } from '@/lib/schema/transactions.shcema';
import { connectDB } from '@/lib/mongodb';
import Transactions from '@/lib/model/transactions';

interface DecodedToken extends JwtPayload {
  id: string;
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

    const transactions = await Transactions.create({
      ...validated,
      accountId: decoded.id,
      categoryId: decoded.id,
    });
  } catch (error) {}
}

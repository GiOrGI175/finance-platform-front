import { NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import { cookies } from 'next/headers';
import { transactionSchema } from '@/lib/schema/transactions.shcema';
import Transactions from '@/lib/model/transactions';

interface DecodedToken extends JwtPayload {
  id: string;
}

type RouteContext = {
  params: Promise<{ id: string }>;
};

// ✅ PATCH (update transaction)
export async function PATCH(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    if (!decoded?.id)
      return NextResponse.json(
        { message: 'Invalid token payload' },
        { status: 401 }
      );

    const body = await req.json();
    const validated = transactionSchema.partial().parse(body);

    await connectDB();

    const updated = await Transactions.findOneAndUpdate(
      { _id: id, accountId: decoded.id },
      validated,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Transaction updated',
      transaction: updated,
    });
  } catch (error) {
    console.error('🔥 PATCH /transactions/[id] error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// ✅ DELETE (delete transaction)
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    await connectDB();

    const deleted = await Transactions.findOneAndDelete({
      _id: id,
      accountId: decoded.id,
    });

    if (!deleted) {
      return NextResponse.json(
        { message: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Transaction deleted' },
      { status: 200 }
    );
  } catch (err) {
    console.error('🔥 DELETE /transactions/[id] error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

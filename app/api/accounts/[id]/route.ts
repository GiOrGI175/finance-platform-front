import { NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { accountSchema } from '@/lib/schema/account.shcema';
import { connectDB } from '@/lib/mongodb';
import Account from '@/lib/model/Account';
import { cookies } from 'next/headers';

interface DecodedToken extends JwtPayload {
  id: string;
}

type RouteContext = {
  params: Promise<{ id: string }>;
};

// ეს ხაზი აუცილებელია ✅
export const dynamic = 'force-dynamic';

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

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
    const validated = accountSchema.partial().parse(body);

    await connectDB();

    const updated = await Account.findOneAndUpdate(
      { _id: id, userId: decoded.id },
      validated,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: 'Account not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Account updated', account: updated });
  } catch (error) {
    console.error('🔥 PATCH /accounts/[id] error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    await connectDB();

    const deleted = await Account.findOneAndDelete({
      _id: id,
      userId: decoded.id,
    });

    if (!deleted) {
      return NextResponse.json(
        { message: 'Account not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Account deleted' }, { status: 200 });
  } catch (err) {
    console.error('🔥 Delete error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

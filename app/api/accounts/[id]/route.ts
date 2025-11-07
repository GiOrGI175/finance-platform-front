import { NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { accountSchema } from '@/lib/schema/account.shcema';
import { connectDB } from '@/lib/mongodb';
import Account from '@/lib/model/Account';

interface DecodedToken extends JwtPayload {
  id: string;
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const authHeader = req.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer '))
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const token = authHeader.split(' ')[1];
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

    if (!updated)
      return NextResponse.json(
        { message: 'Account not found' },
        { status: 404 }
      );

    return NextResponse.json({ message: 'Account updated', account: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer '))
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    if (!decoded?.id) {
      return NextResponse.json(
        { message: 'Invalid token payload' },
        { status: 401 }
      );
    }

    await connectDB();

    const deleted = await Account.findOneAndDelete({
      _id: id,
      userId: decoded.id,
    });

    if (!deleted)
      return NextResponse.json(
        { message: 'Account not found' },
        { status: 404 }
      );

    return NextResponse.json({ message: 'Account deleted' });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

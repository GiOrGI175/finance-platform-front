import { NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import Account from '@/lib/model/Account';
import { accountSchema } from '@/lib/schema/account.shcema';
import { cookies } from 'next/headers';

interface DecodedToken extends JwtPayload {
  id: string;
}

export async function POST(req: Request) {
  try {
    const copkieStore = await cookies();
    const token = copkieStore.get('token')?.value;

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
    const validated = accountSchema.parse(body);

    await connectDB();

    const account = await Account.create({
      ...validated,
      userId: decoded.id,
    });

    return NextResponse.json(
      { message: 'Account created successfully', account },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);

    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { message: 'Validation failed', issues: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const copkieStore = await cookies();
    const token = copkieStore.get('token')?.value;

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

    const accounts = await Account.find({ userId: decoded.id });

    return NextResponse.json({ accounts }, { status: 200 });
  } catch (error) {
    console.error('GET /accounts error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

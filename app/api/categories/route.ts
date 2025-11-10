import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { categoriesSchema } from '@/lib/schema/categories.shcema';
import { connectDB } from '@/lib/mongodb';
import Categories from '@/lib/model/Categories';

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
    const validated = categoriesSchema.parse(body);

    await connectDB();

    const category = await Categories.create({
      ...validated,
      userId: decoded.id,
    });

    return NextResponse.json(
      {
        message: 'Account created successfully',
        category,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

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

    const categories = await Categories.find({ userId: decoded.id });

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error('GET /categories error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

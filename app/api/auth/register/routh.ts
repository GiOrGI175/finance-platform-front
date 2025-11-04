import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/model/user';

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();
    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashed });

    return NextResponse.json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

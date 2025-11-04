import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/model/User';

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();
    console.log('Registration attempt:', { username, email });

    await connectDB();
    console.log('DB Connected');

    const existing = await User.findOne({ email });

    if (existing) {
      console.log('User already exists:', email);
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashed,
    });

    console.log('User created:', newUser._id);

    return NextResponse.json(
      { message: 'User registered successfully', success: true },
      { status: 201 }
    );
  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json(
      {
        message: err instanceof Error ? err.message : 'Server error',
        success: false,
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/model/User';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    await connectDB();

    const user = await User.findOne({ email });

    if (!user)
      return NextResponse.json({ message: 'User not found' }, { status: 404 });

    const valid = await bcrypt.compare(password, user.password);

    if (!valid)
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: '7d',
      }
    );

    const res = NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });

    res.cookies.set('token', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return res;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

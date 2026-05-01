import { NextRequest, NextResponse } from 'next/server';
import type { UserLoginInput, ApiResponse } from '@/lib/types';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const body: UserLoginInput = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Proxy login check to Express Backend
    const beRes = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await beRes.json();

    if (!beRes.ok || !data.success) {
      return NextResponse.json(
        { success: false, error: data.error || 'Invalid credentials' },
        { status: beRes.status || 401 }
      );
    }

    // Ensure we use NextResponse to set cookie correctly in Next.js 14
    const response = NextResponse.json({
      success: true,
      data: {
        id: data.data.id,
        email: data.data.email,
        name: data.data.name,
        role: data.data.role
      },
      message: 'Login successful'
    });

    response.cookies.set('auth_token', data.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[Login Error]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to login' },
      { status: 500 }
    );
  }
}

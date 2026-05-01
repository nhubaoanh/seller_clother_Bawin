import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // Basic decode to avoid needing SECRET_KEY here, or we can proxy to BE
    // For now we decode JWT payload to get user info. BE handles the actual validation
    const decoded = jwt.decode(token) as any;
    
    if (!decoded || !decoded.id) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name || 'User', // If name isn't in token, default to User
        role: decoded.role,
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Token error' }, { status: 401 });
  }
}
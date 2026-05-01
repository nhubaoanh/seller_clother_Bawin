import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ success: false, error: 'Chưa đăng nhập' }, { status: 401 });
    }

    // Proxy tới Express Backend (cổng 3000)
    const beRes = await fetch(`http://localhost:3000/api/orders/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await beRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Get Order Details API Error]', error);
    return NextResponse.json({ success: false, error: 'Lỗi hệ thống' }, { status: 500 });
  }
}

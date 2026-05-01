import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    let userIdFromCookie = null;
    if (token) {
      try {
        const decoded = jwt.decode(token) as any;
        userIdFromCookie = decoded?.id || decoded?.userId;
      } catch (e) {
        console.error('JWT Decode Error:', e);
      }
    }

    const body = await req.json();
    
    // Đảm bảo lấy được userId
    const finalUserId = body.userId || userIdFromCookie;

    // Log chi tiết để kiểm tra trước khi gửi xuống Backend
    console.log('🚀 [Proxy] Data being sent to Backend:', { 
      userId: finalUserId, 
      itemsCount: body.items?.length,
      paymentMethod: body.paymentMethod 
    });

    // Gọi thẳng tới Endpoint của Express Backend
    // Lưu ý: Địa chỉ chính xác là /api/orders/create
    const beRes = await fetch('http://localhost:3000/api/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: finalUserId,
        items: body.items,
        shippingAddress: body.shippingAddress,
        phone: body.phone,
        paymentMethod: body.paymentMethod
      })
    });

    const data = await beRes.json();

    if (!beRes.ok || !data.success) {
      return NextResponse.json(
        { success: false, error: data.error || 'Backend từ chối đơn hàng' },
        { status: beRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.data,
      message: 'Đặt hàng thành công'
    });
  } catch (error) {
    console.error('[Create Order API Error]', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi kết nối giữa Proxy và Backend' },
      { status: 500 }
    );
  }
}

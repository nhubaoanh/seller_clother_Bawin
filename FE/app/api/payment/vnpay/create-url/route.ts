import { NextRequest, NextResponse } from 'next/server';
import { buildVNPayUrl } from '@/lib/helpers';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import type { ApiResponse } from '@/lib/types';

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.userId !== user.userId) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.paymentMethod !== 'VNPAY') {
      return NextResponse.json(
        { success: false, error: 'Invalid payment method' },
        { status: 400 }
      );
    }

    // Get environment variables
    const merchantId = process.env.VNPAY_MERCHANT_ID || '';
    const merchantKey = process.env.VNPAY_MERCHANT_KEY || '';
    const returnUrl = process.env.VNPAY_RETURN_URL || '';

    if (!merchantId || !merchantKey || !returnUrl) {
      console.error('[VNPay Config Error] Missing VNPay configuration');
      return NextResponse.json(
        { success: false, error: 'Payment configuration error' },
        { status: 500 }
      );
    }

    // Get client IP
    const ipAddr = (req.headers.get('x-forwarded-for') || req.headers.get('x-client-ip') || '127.0.0.1').split(',')[0].trim();

    // Create VNPay URL
    const params = {
      vnp_TxnRef: order.id,
      vnp_OrderInfo: `Order #${order.orderNumber}`,
      vnp_OrderType: 'other',
      vnp_Amount: Math.floor(order.finalAmount * 100), // VNPay expects amount in VND * 100
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: new Date().toISOString().replace(/[-:]/g, '').split('T')[0] + new Date().toISOString().split('T')[1].split('.')[0],
    };

    const paymentUrl = buildVNPayUrl(params, merchantKey, returnUrl, merchantId);

    return NextResponse.json({
      success: true,
      data: {
        paymentUrl,
      },
    });
  } catch (error) {
    console.error('[Create Payment URL Error]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create payment URL' },
      { status: 500 }
    );
  }
}

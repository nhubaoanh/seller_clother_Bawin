import { NextRequest, NextResponse } from 'next/server';
import { verifyVNPaySignature } from '@/lib/helpers';
import { prisma } from '@/lib/db';
import type { ApiResponse } from '@/lib/types';

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const { searchParams } = new URL(req.url);

    // Get VNPay response parameters
    const params: Record<string, any> = {};
    for (const [key, value] of searchParams) {
      params[key] = value;
    }

    const merchantKey = process.env.VNPAY_MERCHANT_KEY || '';

    // Verify signature
    const vnpSecureHash = params.vnp_SecureHash;
    delete params.vnp_SecureHash;
    delete params.vnp_SecureHashType;

    const isValidSignature = verifyVNPaySignature(params, merchantKey, vnpSecureHash);

    if (!isValidSignature) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const orderId = params.vnp_TxnRef;
    const responseCode = params.vnp_ResponseCode;

    // Get order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order status based on response
    if (responseCode === '00') {
      // Payment successful
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'COMPLETED',
          orderStatus: 'CONFIRMED',
          vnpayTransactionId: params.vnp_TransactionNo,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Payment successful',
        data: {
          orderId,
          paymentStatus: 'COMPLETED',
        },
      });
    } else {
      // Payment failed
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'FAILED',
          orderStatus: 'CANCELLED',
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Payment failed',
          message: `VNPay response code: ${responseCode}`,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('[Payment Return Error]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process payment return' },
      { status: 500 }
    );
  }
}

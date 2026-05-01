import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { ApiResponse, CouponDetail } from '@/lib/types';

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<CouponDetail | null>>> {
  try {
    const body = await req.json();
    const { code, orderAmount } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    // Find coupon
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: 'Invalid coupon code' },
        { status: 404 }
      );
    }

    // Check if active
    if (!coupon.isActive) {
      return NextResponse.json(
        { success: false, error: 'Coupon is inactive' },
        { status: 400 }
      );
    }

    // Check expiry
    if (new Date() > coupon.expiryDate) {
      return NextResponse.json(
        { success: false, error: 'Coupon has expired' },
        { status: 400 }
      );
    }

    // Check max usage
    if (coupon.maxUseCount && coupon.currentUseCount >= coupon.maxUseCount) {
      return NextResponse.json(
        { success: false, error: 'Coupon usage limit reached' },
        { status: 400 }
      );
    }

    // Check minimum order amount
    if (orderAmount && orderAmount < coupon.minOrderAmount) {
      return NextResponse.json(
        {
          success: false,
          error: `Minimum order amount is ${coupon.minOrderAmount}`,
        },
        { status: 400 }
      );
    }

    // Calculate discount
    let discountAmount = 0;
    if (orderAmount) {
      if (coupon.discountType === 'PERCENT') {
        discountAmount = (orderAmount * coupon.discountValue) / 100;
      } else {
        discountAmount = coupon.discountValue;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount,
        expiryDate: coupon.expiryDate,
        discountAmount,
      },
    });
  } catch (error) {
    console.error('[Validate Coupon Error]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}

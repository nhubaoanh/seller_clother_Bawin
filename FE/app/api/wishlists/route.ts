import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { parseImageUrls } from '@/lib/helpers';
import type { ApiResponse } from '@/lib/types';

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const wishlists = await prisma.wishlist.findMany({
      where: { userId: user.userId },
      include: {
        product: {
          include: {
            variants: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedWishlists = wishlists.map((w) => ({
      id: w.id,
      product: {
        id: w.product.id,
        name: w.product.name,
        slug: w.product.slug,
        description: w.product.description,
        image: w.product.image,
        images: parseImageUrls(w.product.images),
        price: w.product.price,
        originalPrice: w.product.originalPrice,
        stock: w.product.stock,
        sold: w.product.sold,
        rating: w.product.rating,
        ratingCount: w.product.ratingCount,
        categoryId: w.product.categoryId,
        variants: w.product.variants.map((v) => ({
          id: v.id,
          size: v.size,
          color: v.color,
          stock: v.stock,
        })),
      },
      createdAt: w.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: {
        wishlists: formattedWishlists,
        total: wishlists.length,
      },
    });
  } catch (error) {
    console.error('[Get Wishlists Error]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wishlists' },
      { status: 500 }
    );
  }
}

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
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if already in wishlist
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: user.userId,
          productId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Already in wishlist' },
        { status: 409 }
      );
    }

    // Add to wishlist
    const wishlist = await prisma.wishlist.create({
      data: {
        userId: user.userId,
        productId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: wishlist,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Add to Wishlist Error]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add to wishlist' },
      { status: 500 }
    );
  }
}

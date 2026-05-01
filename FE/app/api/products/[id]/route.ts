import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { parseImageUrls } from '@/lib/helpers';
import type { ApiResponse, ProductDetail } from '@/lib/types';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<ProductDetail>>> {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true,
        reviews: {
          select: { rating: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const productDetail: ProductDetail = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      image: product.image,
      images: parseImageUrls(product.images),
      price: product.price,
      originalPrice: product.originalPrice,
      stock: product.stock,
      sold: product.sold,
      rating: product.rating,
      ratingCount: product.ratingCount,
      categoryId: product.categoryId,
      variants: product.variants.map((v) => ({
        id: v.id,
        size: v.size,
        color: v.color,
        stock: v.stock,
      })),
    };

    return NextResponse.json({
      success: true,
      data: productDetail,
    });
  } catch (error) {
    console.error('[Get Product Detail Error]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

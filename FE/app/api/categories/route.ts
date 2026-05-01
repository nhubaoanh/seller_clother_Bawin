import { NextRequest, NextResponse } from 'next/server';
import { beClient } from '@/lib/services/apiClient';
import type { ApiResponse } from '@/lib/types';

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const res = await beClient.get('/categories');
    
    if (!res.success) {
       throw new Error(res.error || 'Failed to fetch categories');
    }

    return NextResponse.json({
      success: true,
      data: {
        categories: res.data || [],
        total: (res.data || []).length,
      },
    });
  } catch (error) {
    console.error('[Get Categories Error]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

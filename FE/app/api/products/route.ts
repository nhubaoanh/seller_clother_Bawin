import { NextRequest, NextResponse } from 'next/server';

// Simple products API - returns empty for now to avoid infinite loop
export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: true,
    data: [],
    message: 'Using Backend Express instead'
  });
}
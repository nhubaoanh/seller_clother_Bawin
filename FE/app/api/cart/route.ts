import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const CART_COOKIE_NAME = 'jm_fashion_cart';

async function getCartFromCookie() {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get(CART_COOKIE_NAME);
  if (!cartCookie) return { items: [] };
  
  try {
    return JSON.parse(cartCookie.value);
  } catch (error) {
    return { items: [] };
  }
}

// Helper to get full image URL
function getImageUrl(path: string | undefined): string {
  if (!path) return '/placeholder.jpg';
  if (path.startsWith('http')) return path;
  
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const baseUrl = 'http://localhost:3000';
  return `${baseUrl}${cleanPath}`;
}

// Fetch product from backend
async function getProductFromBackend(productId: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/products/${productId}`);
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) {
        return {
          id: data.data.productId || data.data.id,
          name: data.data.productName || data.data.name,
          price: parseFloat(data.data.basePrice || data.data.price || 0),
          image: getImageUrl(data.data.thumbnail || data.data.image)
        };
      }
    }
  } catch (error) {
    console.error('Error fetching product:', error);
  }
  return null;
}

function createResponseWithCookie(data: any, cart: any, status = 200) {
  const response = NextResponse.json(data, { status });
  response.cookies.set(CART_COOKIE_NAME, JSON.stringify(cart), {
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    sameSite: 'lax',
  });
  return response;
}

export async function GET(req: NextRequest) {
  const cart = await getCartFromCookie();
  
  const subtotal = cart.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.1); // 10% VAT
  const shipping = subtotal >= 500000 ? 0 : 30000; // Free shipping over 500k
  const total = subtotal + tax + shipping;

  return NextResponse.json({
    success: true,
    data: {
      items: cart.items,
      subtotal,
      tax,
      shipping,
      total,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { productId, quantity = 1, userId } = body;
    
    // Auto-fetch userId from auth cookie if not provided
    if (!userId) {
      const cookieStore = await cookies();
      const token = cookieStore.get('auth_token')?.value;
      if (token) {
        try {
          const decoded = jwt.decode(token) as any;
          userId = decoded?.id;
        } catch (e) {}
      }
    }

    if (!productId) {
      return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
    }

    const product = await getProductFromBackend(productId);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const cart = await getCartFromCookie();
    // Lấy ID khi đăng nhập vào ý
    if (userId) {
      cart.userId = userId;
    }
    
    const existingItemIndex = cart.items.findIndex((item: any) => item.productId === productId);
    
    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        id: `${Date.now()}-${productId}`,
        productId,
        product,
        quantity,
        price: product.price,
      });
    }

    return createResponseWithCookie({
      success: true,
      message: 'Added to cart successfully',
      data: { itemCount: cart.items.length }
    }, cart);
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to add to cart' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, quantity } = body;
    
    if (!id || quantity === undefined) {
      return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
    }

    const cart = await getCartFromCookie();
    const itemIndex = cart.items.findIndex((item: any) => item.id === id || item.productId === id);
    
    if (itemIndex >= 0) {
      if (quantity > 0) {
        cart.items[itemIndex].quantity = quantity;
      } else {
        cart.items.splice(itemIndex, 1);
      }
      return createResponseWithCookie({ success: true, message: 'Cart updated' }, cart);
    }

    return NextResponse.json({ success: false, error: 'Item not found in cart' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update cart' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Item ID required' }, { status: 400 });
    }

    const cart = await getCartFromCookie();
    cart.items = cart.items.filter((item: any) => item.id !== id && item.productId !== id);
    
    return createResponseWithCookie({ success: true, message: 'Item removed' }, cart);
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to remove item' }, { status: 500 });
  }
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatCurrency } from '@/lib/helpers';

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [formData, setFormData] = useState({
    shippingAddress: '',
    shippingPhone: '',
    paymentMethod: 'VNPAY',
  });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    params.then((p) => {
      setOrderId(p.orderId);
      fetchOrder(p.orderId);
    });
  }, [params]);

  const fetchOrder = async (id: string) => {
    try {
      // Note: We'll need to create an endpoint to fetch order details
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setProcessing(true);

    try {
      // Validate form
      if (!formData.shippingAddress || !formData.shippingPhone) {
        setError('Vui lòng điền đầy đủ địa chỉ và số điện thoại');
        setProcessing(false);
        return;
      }

      if (formData.paymentMethod === 'VNPAY') {
        // Create payment URL
        const response = await fetch('/api/payment/vnpay/create-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId }),
        });

        const data = await response.json();

        if (data.success) {
          // Redirect to VNPay
          window.location.href = data.data.paymentUrl;
        } else {
          setError(data.error || 'Tạo link thanh toán thất bại');
        }
      } else {
        // COD payment - just confirm order
        alert('Đơn hàng của bạn đã được xác nhận. Chúng tôi sẽ liên hệ bạn sớm.');
        router.push('/orders');
      }
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Thanh toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="font-bold text-lg mb-4">Địa chỉ giao hàng</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ
                      </label>
                      <textarea
                        value={formData.shippingAddress}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            shippingAddress: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        value={formData.shippingPhone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            shippingPhone: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-600"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h2 className="font-bold text-lg mb-4">Phương thức thanh toán</h2>
                  <div className="space-y-3">
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="VNPAY"
                        checked={formData.paymentMethod === 'VNPAY'}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            paymentMethod: e.target.value,
                          })
                        }
                        className="mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-900">VNPay</p>
                        <p className="text-sm text-gray-600">
                          Thanh toán trực tuyến qua VNPay
                        </p>
                      </div>
                    </label>
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={formData.paymentMethod === 'COD'}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            paymentMethod: e.target.value,
                          })
                        }
                        className="mr-3"
                      />
                      <div>
                        <p className="font-medium text-gray-900">Thanh toán khi nhận hàng</p>
                        <p className="text-sm text-gray-600">
                          Thanh toán trực tiếp với shipper
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-rose-600 text-white py-3 rounded-lg hover:bg-rose-700 transition font-medium disabled:opacity-50"
                >
                  {processing ? 'Đang xử lý...' : 'Hoàn tất thanh toán'}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h2 className="font-bold text-lg mb-4">Tóm tắt đơn hàng</h2>
              <div className="space-y-2 pb-4 border-b border-gray-200 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính</span>
                  <span>00.000đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Vận chuyển</span>
                  <span>Miễn phí</span>
                </div>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng</span>
                <span className="text-rose-600">00.000đ</span>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  ℹ️ Vui lòng điền đầy đủ địa chỉ giao hàng để chúng tôi có thể xác nhận đơn
                  hàng của bạn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

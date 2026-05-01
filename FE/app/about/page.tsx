import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Về chúng tôi</h1>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">JM Fashion - Thương hiệu thời trang nữ hàng đầu</h2>
            <p>
              JM Fashion là một thương hiệu thời trang nữ uy tín, chuyên cung cấp những bộ sưu tập quần áo chất lượng cao 
              với mẫu mã đa dạng, theo xu hướng thời trang hiện đại.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sứ mệnh</h2>
            <p>
              Chúng tôi cam kết mang đến cho phụ nữ Việt Nam những sản phẩm thời trang chất lượng tốt, mẫu mã đẹp, 
              với giá cách để mọi người đều có thể sở hữu những bộ trang phục yêu thích.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Giá trị cốt lõi</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Chất lượng:</strong> Tất cả sản phẩm được kiểm tra kỹ lưỡng trước khi giao cho khách hàng</li>
              <li><strong>Sáng tạo:</strong> Không ngừng cập nhật những mẫu mã mới, theo xu hướng thế giới</li>
              <li><strong>Khách hàng là trung tâm:</strong> Luôn lắng nghe và cải thiện dịch vụ</li>
              <li><strong>Bền vững:</strong> Cam kết với môi trường và xã hội</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tại sao chọn JM Fashion?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Đa dạng mẫu mã</h3>
                <p>Bộ sưu tập phong phú từ casual đến formal, phù hợp với mọi dịp</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Chất lượng tốt</h3>
                <p>Chất liệu cao cấp, được kiểm tra kỹ lưỡng trước giao hàng</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Giá cạnh tranh</h3>
                <p>Cung cấp giá tốt nhất mà không ảnh hưởng chất lượng</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Dịch vụ tuyệt vời</h3>
                <p>Giao hàng nhanh, hoàn trả dễ dàng, hỗ trợ khách hàng 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

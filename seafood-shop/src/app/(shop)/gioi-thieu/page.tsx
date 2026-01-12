import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giới thiệu - Mỡ Mê Cá',
  description: 'Tìm hiểu về Mỡ Mê Cá - Chuyên cung cấp hải sản tươi sống chất lượng cao',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Về Mỡ Mê Cá</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Chuyên cung cấp hải sản tươi sống và IQF chất lượng cao
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                <span className="text-primary">Câu chuyện</span> của chúng tôi
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Mỡ Mê Cá được thành lập với sứ mệnh mang đến những sản phẩm hải sản tươi ngon nhất 
                đến tay người tiêu dùng Việt Nam. Chúng tôi tin rằng mỗi bữa ăn đều xứng đáng có 
                những nguyên liệu tốt nhất.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Với đội ngũ chuyên gia giàu kinh nghiệm trong ngành hải sản, chúng tôi cam kết 
                chọn lọc kỹ lưỡng từng sản phẩm, đảm bảo độ tươi ngon và an toàn vệ sinh thực phẩm.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Từ những con cua béo ngậy, tôm hùm tươi sống đến cá hồi nhập khẩu - tất cả đều 
                được vận chuyển trong điều kiện bảo quản tối ưu để giữ trọn hương vị tự nhiên.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=600&h=600&fit=crop" 
                  alt="Hải sản tươi sống"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-accent text-white p-6 rounded-xl shadow-lg">
                <p className="text-4xl font-bold">5+</p>
                <p className="text-sm">Năm kinh nghiệm</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            <span className="text-primary">Giá trị</span> cốt lõi
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-cream rounded-2xl">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                <span className="text-3xl">🦐</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Chất lượng hàng đầu</h3>
              <p className="text-gray-600">
                100% hải sản tươi sống, được kiểm tra chất lượng nghiêm ngặt trước khi đến tay khách hàng.
              </p>
            </div>
            <div className="text-center p-8 bg-cream rounded-2xl">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Giao hàng nhanh chóng</h3>
              <p className="text-gray-600">
                Giao hàng trong 2-4 giờ nội thành, đảm bảo hải sản luôn tươi ngon khi đến tay bạn.
              </p>
            </div>
            <div className="text-center p-8 bg-cream rounded-2xl">
              <div className="w-16 h-16 mx-auto mb-4 bg-accent rounded-full flex items-center justify-center">
                <span className="text-3xl">💯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cam kết hoàn tiền</h3>
              <p className="text-gray-600">
                Hoàn tiền 100% nếu sản phẩm không đạt chất lượng như cam kết.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-2">10K+</p>
              <p className="text-white/80">Khách hàng</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-2">50K+</p>
              <p className="text-white/80">Đơn hàng</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-2">100+</p>
              <p className="text-white/80">Sản phẩm</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold mb-2">99%</p>
              <p className="text-white/80">Hài lòng</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

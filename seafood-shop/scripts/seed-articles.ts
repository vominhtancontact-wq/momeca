import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI!;

// Article Schema
const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    thumbnail: { type: String, default: '' },
    category: { 
      type: String, 
      enum: ['kien-thuc', 'cong-thuc', 'tin-tuc', 'meo-hay'],
      default: 'tin-tuc'
    },
    author: { type: String, default: 'Admin' },
    isPublished: { type: Boolean, default: true },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Article = mongoose.models.Article || mongoose.model('Article', ArticleSchema);

const articles = [
  {
    title: 'Ốc Gai Nấu Gì Ngon? Mách Bạn 07 Cách Chế Biến Ốc Gai Ăn Là Ghiền',
    slug: 'oc-gai-nau-gi-ngon-07-cach-che-bien',
    excerpt: 'Nếu bạn chưa biết nên ốc gai nấu gì ngon sao cho vừa đơn giản, vừa nhanh gọn mà lại vừa ngon. Vẫn giữ được vị ngon tự nhiên của ốc gai...',
    category: 'cong-thuc',
    thumbnail: 'https://res.cloudinary.com/ddvgiacg5/image/upload/v1705123456/seafood-shop/articles/oc-gai.jpg',
    content: `
<h2>Ốc gai là gì?</h2>
<p>Ốc gai là loại ốc biển có vỏ cứng với nhiều gai nhọn bao phủ bên ngoài. Thịt ốc gai có vị ngọt tự nhiên, dai giòn và rất thơm ngon. Đây là món ăn được nhiều người yêu thích, đặc biệt là trong các bữa nhậu.</p>

<h2>1. Ốc gai hấp sả</h2>
<p>Đây là cách chế biến đơn giản nhất nhưng giữ được trọn vẹn hương vị tự nhiên của ốc.</p>
<p><strong>Nguyên liệu:</strong></p>
<ul>
<li>500g ốc gai tươi</li>
<li>3-4 cây sả đập dập</li>
<li>Lá chanh, ớt</li>
<li>Muối tiêu chanh</li>
</ul>
<p><strong>Cách làm:</strong> Rửa sạch ốc, cho vào nồi cùng sả và lá chanh. Hấp 10-15 phút đến khi ốc chín. Chấm với muối tiêu chanh.</p>

<h2>2. Ốc gai xào bơ tỏi</h2>
<p>Món ốc gai xào bơ tỏi thơm lừng, béo ngậy là lựa chọn hoàn hảo cho bữa nhậu.</p>
<p><strong>Nguyên liệu:</strong></p>
<ul>
<li>500g ốc gai</li>
<li>50g bơ</li>
<li>5-6 tép tỏi băm</li>
<li>Hành lá, tiêu</li>
</ul>

<h2>3. Ốc gai nướng mỡ hành</h2>
<p>Ốc gai nướng mỡ hành là món ăn vặt được yêu thích tại các quán nhậu vỉa hè.</p>

<h2>4. Ốc gai luộc</h2>
<p>Cách đơn giản nhất để thưởng thức vị ngọt tự nhiên của ốc gai.</p>

<h2>5. Ốc gai rang muối ớt</h2>
<p>Vị cay nồng của ớt kết hợp với vị mặn của muối tạo nên món ốc gai rang muối ớt hấp dẫn.</p>

<h2>6. Ốc gai nấu cháo</h2>
<p>Cháo ốc gai bổ dưỡng, thơm ngon, phù hợp cho cả gia đình.</p>

<h2>7. Ốc gai xào me</h2>
<p>Vị chua ngọt của me kết hợp với ốc gai tạo nên món ăn độc đáo.</p>

<h2>Mẹo chọn ốc gai tươi ngon</h2>
<ul>
<li>Chọn ốc còn sống, bám chặt vào vỏ</li>
<li>Vỏ ốc không bị nứt, vỡ</li>
<li>Không có mùi hôi tanh</li>
<li>Thịt ốc có màu trắng ngà</li>
</ul>
    `
  },
  {
    title: 'Sò Tai Tượng Nấu Súp | Món Ăn Dinh Dưỡng Ngon Tuyệt Cho Cả Gia Đình',
    slug: 'so-tai-tuong-nau-sup-mon-an-dinh-duong',
    excerpt: 'Sò tai tượng nấu súp là món ăn bổ dưỡng, thơm ngon với hương vị đậm đà. Cách nấu đơn giản, phù hợp cho bữa cơm gia đình.',
    category: 'cong-thuc',
    thumbnail: 'https://res.cloudinary.com/ddvgiacg5/image/upload/v1705123456/seafood-shop/articles/so-tai-tuong.jpg',
    content: `
<h2>Giới thiệu về sò tai tượng</h2>
<p>Sò tai tượng là loại hải sản quý, có kích thước lớn với vỏ hình dạng giống tai voi. Thịt sò tai tượng có vị ngọt thanh, giàu protein và các khoáng chất có lợi cho sức khỏe.</p>

<h2>Nguyên liệu cần chuẩn bị</h2>
<ul>
<li>2-3 con sò tai tượng (khoảng 500g)</li>
<li>200g nấm rơm</li>
<li>100g cà rốt</li>
<li>50g hành tây</li>
<li>2 quả trứng gà</li>
<li>Hành lá, ngò rí</li>
<li>Gia vị: muối, tiêu, bột ngọt, dầu mè</li>
</ul>

<h2>Cách làm sò tai tượng nấu súp</h2>

<h3>Bước 1: Sơ chế sò tai tượng</h3>
<p>Rửa sạch sò tai tượng, luộc sơ qua nước sôi khoảng 2-3 phút. Tách thịt sò ra khỏi vỏ, cắt thành miếng vừa ăn.</p>

<h3>Bước 2: Chuẩn bị các nguyên liệu khác</h3>
<p>Nấm rơm rửa sạch, cắt đôi. Cà rốt gọt vỏ, cắt hạt lựu. Hành tây cắt múi cau.</p>

<h3>Bước 3: Nấu súp</h3>
<p>Đun sôi 1.5 lít nước, cho cà rốt vào nấu trước 5 phút. Tiếp theo cho nấm rơm, hành tây vào nấu thêm 3 phút.</p>

<h3>Bước 4: Hoàn thành</h3>
<p>Cho thịt sò tai tượng vào, nêm gia vị vừa ăn. Đánh tan trứng, đổ từ từ vào nồi súp. Rắc hành lá, ngò rí và một ít dầu mè lên trên.</p>

<h2>Mẹo nấu súp sò tai tượng ngon</h2>
<ul>
<li>Không nấu sò quá lâu để thịt không bị dai</li>
<li>Có thể thêm một ít gừng để khử mùi tanh</li>
<li>Dùng nóng để cảm nhận trọn vẹn hương vị</li>
</ul>
    `
  },
  {
    title: 'Tác Dụng Của Tôm Biển Là Gì? Bật Mí Điều Có Thể Bạn Chưa Biết',
    slug: 'tac-dung-cua-tom-bien-la-gi',
    excerpt: 'Tôm biển không chỉ là món ăn ngon mà còn mang lại nhiều lợi ích sức khỏe tuyệt vời. Cùng tìm hiểu những tác dụng của tôm biển đối với cơ thể.',
    category: 'kien-thuc',
    thumbnail: 'https://res.cloudinary.com/ddvgiacg5/image/upload/v1705123456/seafood-shop/articles/tom-bien.jpg',
    content: `
<h2>Giá trị dinh dưỡng của tôm biển</h2>
<p>Tôm biển là nguồn protein chất lượng cao với hàm lượng chất béo thấp. Trong 100g tôm biển chứa:</p>
<ul>
<li>Protein: 24g</li>
<li>Chất béo: 0.3g</li>
<li>Omega-3: 540mg</li>
<li>Vitamin B12: 1.9mcg</li>
<li>Selen: 40mcg</li>
<li>Kẽm: 1.6mg</li>
</ul>

<h2>Các tác dụng của tôm biển đối với sức khỏe</h2>

<h3>1. Tốt cho tim mạch</h3>
<p>Omega-3 trong tôm biển giúp giảm cholesterol xấu, ngăn ngừa xơ vữa động mạch và các bệnh tim mạch.</p>

<h3>2. Tăng cường hệ miễn dịch</h3>
<p>Kẽm và selen trong tôm biển là những khoáng chất quan trọng giúp tăng cường hệ miễn dịch, chống lại các bệnh nhiễm trùng.</p>

<h3>3. Tốt cho xương khớp</h3>
<p>Tôm biển chứa nhiều canxi và phospho, giúp xương chắc khỏe, phòng ngừa loãng xương.</p>

<h3>4. Cải thiện chức năng não bộ</h3>
<p>Omega-3 và vitamin B12 trong tôm biển hỗ trợ chức năng não bộ, cải thiện trí nhớ và khả năng tập trung.</p>

<h3>5. Tốt cho da và tóc</h3>
<p>Protein và các vitamin trong tôm biển giúp da khỏe mạnh, tóc bóng mượt.</p>

<h3>6. Hỗ trợ giảm cân</h3>
<p>Với hàm lượng protein cao và chất béo thấp, tôm biển là thực phẩm lý tưởng cho người muốn giảm cân.</p>

<h2>Lưu ý khi ăn tôm biển</h2>
<ul>
<li>Người bị dị ứng hải sản không nên ăn</li>
<li>Không ăn tôm đã chết hoặc có mùi lạ</li>
<li>Nên nấu chín kỹ trước khi ăn</li>
<li>Không nên ăn quá nhiều (2-3 lần/tuần là đủ)</li>
</ul>
    `
  },
  {
    title: 'Chi Tiết 5 Cách Làm Ốc Bươu Xào Thơm Ngon Độc Đáo Nhất',
    slug: 'chi-tiet-5-cach-lam-oc-buou-xao',
    excerpt: 'Ốc bươu xào là món ăn dân dã nhưng vô cùng hấp dẫn. Cùng khám phá 5 cách làm ốc bươu xào thơm ngon, độc đáo nhất.',
    category: 'cong-thuc',
    thumbnail: 'https://res.cloudinary.com/ddvgiacg5/image/upload/v1705123456/seafood-shop/articles/oc-buou.jpg',
    content: `
<h2>1. Ốc bươu xào sả ớt</h2>
<p>Đây là cách chế biến phổ biến nhất, mang đậm hương vị Việt Nam.</p>
<p><strong>Nguyên liệu:</strong></p>
<ul>
<li>500g ốc bươu</li>
<li>3 cây sả băm</li>
<li>5-6 quả ớt</li>
<li>Tỏi, hành tím</li>
<li>Nước mắm, đường</li>
</ul>
<p><strong>Cách làm:</strong> Phi thơm tỏi, hành, cho sả ớt vào xào. Thêm ốc bươu đã luộc sơ, nêm gia vị và xào đều đến khi thấm.</p>

<h2>2. Ốc bươu xào me</h2>
<p>Vị chua ngọt của me kết hợp với ốc bươu tạo nên món ăn hấp dẫn.</p>

<h2>3. Ốc bươu xào dừa</h2>
<p>Nước cốt dừa béo ngậy làm cho món ốc bươu thêm phần đặc biệt.</p>

<h2>4. Ốc bươu xào chuối đậu</h2>
<p>Sự kết hợp độc đáo giữa ốc bươu, chuối xanh và đậu phụ.</p>

<h2>5. Ốc bươu xào lá lốt</h2>
<p>Hương thơm đặc trưng của lá lốt làm tăng thêm hương vị cho món ốc.</p>

<h2>Mẹo sơ chế ốc bươu</h2>
<ul>
<li>Ngâm ốc với nước vo gạo 2-3 tiếng để ốc nhả hết bùn đất</li>
<li>Chặt đuôi ốc để dễ hút khi ăn</li>
<li>Luộc sơ ốc trước khi xào để ốc chín đều</li>
</ul>
    `
  },
  {
    title: 'Cách Ăn Hàu Sống Béo, Ngậy, Không Tanh Và Những Điều Cần Chú Ý',
    slug: 'cach-an-hau-song-beo-ngay-khong-tanh',
    excerpt: 'Hàu sống là món ăn cao cấp được nhiều người yêu thích. Tìm hiểu cách ăn hàu sống đúng cách để thưởng thức trọn vẹn hương vị.',
    category: 'kien-thuc',
    thumbnail: 'https://res.cloudinary.com/ddvgiacg5/image/upload/v1705123456/seafood-shop/articles/hau-song.jpg',
    content: `
<h2>Hàu sống là gì?</h2>
<p>Hàu sống (oyster) là loại hải sản được ăn tươi sống, không qua chế biến nhiệt. Hàu có vị ngọt thanh, béo ngậy và giàu dinh dưỡng.</p>

<h2>Cách chọn hàu tươi ngon</h2>
<ul>
<li>Vỏ hàu phải đóng kín, không bị hở</li>
<li>Khi gõ vào vỏ có tiếng đặc</li>
<li>Thịt hàu có màu trắng ngà hoặc xám nhạt</li>
<li>Không có mùi hôi tanh</li>
<li>Nước trong vỏ hàu phải trong</li>
</ul>

<h2>Cách ăn hàu sống đúng cách</h2>

<h3>Bước 1: Mở vỏ hàu</h3>
<p>Dùng dao chuyên dụng để mở vỏ hàu. Cắt cơ hàu để tách thịt ra khỏi vỏ.</p>

<h3>Bước 2: Kiểm tra độ tươi</h3>
<p>Hàu tươi khi chạm vào sẽ co lại. Nếu hàu không phản ứng, không nên ăn.</p>

<h3>Bước 3: Thưởng thức</h3>
<p>Vắt một ít chanh lên hàu, có thể thêm một chút tiêu hoặc nước mắm gừng. Đưa vỏ hàu lên miệng và hút nhẹ.</p>

<h2>Các loại nước chấm phổ biến</h2>
<ul>
<li>Chanh + tiêu</li>
<li>Nước mắm gừng</li>
<li>Wasabi + xì dầu</li>
<li>Cocktail sauce</li>
<li>Mignonette (giấm hành)</li>
</ul>

<h2>Những điều cần lưu ý</h2>
<ul>
<li>Chỉ ăn hàu từ nguồn uy tín, đảm bảo vệ sinh</li>
<li>Phụ nữ mang thai không nên ăn hàu sống</li>
<li>Người có hệ miễn dịch yếu nên tránh</li>
<li>Không ăn hàu đã mở vỏ quá 2 tiếng</li>
</ul>
    `
  },
  {
    title: 'TOP 03 Tư Hải Hấp Thơm Ngon Càng Ăn Càng Mê',
    slug: 'top-03-tu-hai-hap-thom-ngon',
    excerpt: 'Tư hải (tu hài) là loại hải sản quý với thịt ngọt, giòn. Khám phá 3 cách hấp tư hải thơm ngon, đơn giản tại nhà.',
    category: 'cong-thuc',
    thumbnail: 'https://res.cloudinary.com/ddvgiacg5/image/upload/v1705123456/seafood-shop/articles/tu-hai.jpg',
    content: `
<h2>Giới thiệu về tư hải</h2>
<p>Tư hải (tu hài) là loại nhuyễn thể hai mảnh vỏ, sống vùi trong cát ở vùng biển. Thịt tư hải có vị ngọt tự nhiên, giòn dai và rất bổ dưỡng.</p>

<h2>1. Tư hải hấp gừng hành</h2>
<p><strong>Nguyên liệu:</strong></p>
<ul>
<li>500g tư hải tươi</li>
<li>50g gừng thái sợi</li>
<li>3 cây hành lá</li>
<li>Dầu ăn, nước mắm</li>
</ul>
<p><strong>Cách làm:</strong> Rửa sạch tư hải, xếp vào đĩa. Rải gừng và hành lên trên. Hấp 8-10 phút. Phi dầu nóng rưới lên, thêm nước mắm.</p>

<h2>2. Tư hải hấp bia</h2>
<p>Bia giúp khử mùi tanh và làm thịt tư hải thêm thơm ngon.</p>
<p><strong>Nguyên liệu:</strong></p>
<ul>
<li>500g tư hải</li>
<li>1 lon bia</li>
<li>Sả, ớt, lá chanh</li>
</ul>

<h2>3. Tư hải hấp tỏi</h2>
<p>Tỏi phi thơm kết hợp với tư hải tạo nên món ăn hấp dẫn.</p>

<h2>Mẹo chọn tư hải tươi</h2>
<ul>
<li>Chọn con còn sống, vòi co giãn khi chạm vào</li>
<li>Vỏ không bị nứt, vỡ</li>
<li>Không có mùi hôi</li>
</ul>
    `
  },
  {
    title: 'Chi Tiết Công Thức Vẹm Xanh Nướng Mỡ Hành Đơn Giản Tại Nhà',
    slug: 'cong-thuc-vem-xanh-nuong-mo-hanh',
    excerpt: 'Vẹm xanh nướng mỡ hành là món ăn vặt được yêu thích. Cùng học cách làm món này đơn giản tại nhà.',
    category: 'cong-thuc',
    thumbnail: 'https://res.cloudinary.com/ddvgiacg5/image/upload/v1705123456/seafood-shop/articles/vem-xanh.jpg',
    content: `
<h2>Nguyên liệu cần chuẩn bị</h2>
<ul>
<li>1kg vẹm xanh tươi</li>
<li>100g hành lá</li>
<li>50g mỡ hành (hoặc dầu ăn)</li>
<li>Đậu phộng rang</li>
<li>Hành phi</li>
<li>Gia vị: muối, tiêu, đường</li>
</ul>

<h2>Cách làm mỡ hành</h2>
<p>Hành lá rửa sạch, thái nhỏ. Phi hành với dầu ăn ở lửa nhỏ đến khi hành chín vàng, thơm. Nêm một chút muối và đường.</p>

<h2>Cách làm vẹm xanh nướng mỡ hành</h2>

<h3>Bước 1: Sơ chế vẹm</h3>
<p>Rửa sạch vẹm xanh, ngâm nước muối 30 phút để vẹm nhả cát. Tách bỏ một nửa vỏ, giữ lại nửa có thịt.</p>

<h3>Bước 2: Nướng vẹm</h3>
<p>Xếp vẹm lên vỉ nướng hoặc khay. Nướng ở nhiệt độ 200°C trong 5-7 phút đến khi vẹm chín.</p>

<h3>Bước 3: Hoàn thành</h3>
<p>Múc mỡ hành rưới đều lên từng con vẹm. Rắc đậu phộng rang và hành phi lên trên. Dùng nóng.</p>

<h2>Mẹo nướng vẹm ngon</h2>
<ul>
<li>Không nướng quá lâu để thịt vẹm không bị dai</li>
<li>Có thể thêm một ít phô mai lên trên trước khi nướng</li>
<li>Dùng kèm với tương ớt hoặc muối tiêu chanh</li>
</ul>
    `
  }
];

async function seedArticles() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Xóa các bài viết cũ (tùy chọn)
    // await Article.deleteMany({});
    // console.log('Deleted old articles');

    // Thêm bài viết mới
    for (const article of articles) {
      const existing = await Article.findOne({ slug: article.slug });
      if (!existing) {
        await Article.create({
          ...article,
          author: 'Mỡ Mê Cá',
          isPublished: true,
          viewCount: Math.floor(Math.random() * 500) + 100
        });
        console.log(`Created: ${article.title}`);
      } else {
        console.log(`Skipped (exists): ${article.title}`);
      }
    }

    console.log('Seed completed!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedArticles();

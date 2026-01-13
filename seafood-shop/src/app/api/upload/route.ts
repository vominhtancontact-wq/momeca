import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { success: false, error: 'Chưa cấu hình Cloudinary' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Không có file được chọn' },
        { status: 400 }
      );
    }

    // Kiểm tra loại file
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Chỉ chấp nhận file ảnh' },
        { status: 400 }
      );
    }

    // Kiểm tra kích thước (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File quá lớn (tối đa 5MB)' },
        { status: 400 }
      );
    }

    // Tạo FormData để gửi lên Cloudinary
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('upload_preset', 'ml_default');
    uploadFormData.append('folder', 'seafood-shop/products');

    // Upload trực tiếp lên Cloudinary API
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: uploadFormData,
      }
    );

    const result = await uploadResponse.json();

    if (!uploadResponse.ok) {
      console.error('Cloudinary error:', result);
      return NextResponse.json(
        { success: false, error: result.error?.message || 'Lỗi upload Cloudinary' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      }
    });
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi khi upload ảnh' },
      { status: 500 }
    );
  }
}

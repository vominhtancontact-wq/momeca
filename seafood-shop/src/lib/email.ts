// Email notification helper using Gmail SMTP
import nodemailer from 'nodemailer';

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || GMAIL_USER;

interface OrderNotification {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  totalAmount: number;
  paymentMethod: 'cod' | 'online';
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
}

export async function sendNewOrderNotification(order: OrderNotification) {
  // Skip if Gmail is not configured
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.log('Email notification skipped: Gmail credentials not configured');
    return { success: false, message: 'Gmail not configured' };
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });

    // Format payment method
    const paymentMethodText = order.paymentMethod === 'cod' 
      ? '💵 Thanh toán khi nhận hàng (COD)' 
      : '🏦 Chuyển khoản ngân hàng';

    // Build items table
    const itemsRows = order.items
      .map(item => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.productName}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.price * item.quantity)}</td>
        </tr>
      `)
      .join('');

    // HTML email template
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .section-title { font-size: 18px; font-weight: bold; color: #667eea; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
    .info-label { font-weight: bold; color: #666; }
    .info-value { color: #333; }
    table { width: 100%; border-collapse: collapse; }
    .total { font-size: 20px; font-weight: bold; color: #667eea; text-align: right; margin-top: 15px; }
    .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 28px;">🔔 ĐƠN HÀNG MỚI</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px;">Bạn có đơn hàng mới từ website Momeca</p>
    </div>
    
    <div class="content">
      <!-- Order Info -->
      <div class="section">
        <div class="section-title">📋 Thông tin đơn hàng</div>
        <div class="info-row">
          <span class="info-label">Mã đơn hàng:</span>
          <span class="info-value" style="font-weight: bold; color: #667eea;">${order.orderNumber}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Phương thức thanh toán:</span>
          <span class="info-value">${paymentMethodText}</span>
        </div>
      </div>

      <!-- Customer Info -->
      <div class="section">
        <div class="section-title">👤 Thông tin khách hàng</div>
        <div class="info-row">
          <span class="info-label">Họ tên:</span>
          <span class="info-value">${order.customerName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Số điện thoại:</span>
          <span class="info-value">${order.customerPhone}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Địa chỉ:</span>
          <span class="info-value">${order.customerAddress}</span>
        </div>
      </div>

      <!-- Products -->
      <div class="section">
        <div class="section-title">🛒 Sản phẩm</div>
        <table>
          <thead>
            <tr style="background: #f5f5f5;">
              <th style="padding: 10px; text-align: left;">Sản phẩm</th>
              <th style="padding: 10px; text-align: center;">Số lượng</th>
              <th style="padding: 10px; text-align: right;">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>
        <div class="total">Tổng cộng: ${formatCurrency(order.totalAmount)}</div>
      </div>

      <!-- Payment Method -->
      <div class="section">
        <div class="section-title">💳 Phương thức thanh toán</div>
        <div>${paymentMethodText}</div>
      </div>

      <!-- Action Button -->
      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://momeca.vn'}/admin/don-hang" class="button">
          Xem chi tiết đơn hàng
        </a>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    // Plain text version
    const textContent = `
🔔 ĐƠN HÀNG MỚI

📋 Mã đơn: ${order.orderNumber}

👤 THÔNG TIN KHÁCH HÀNG:
- Tên: ${order.customerName}
- SĐT: ${order.customerPhone}
- Địa chỉ: ${order.customerAddress}

🛒 SẢN PHẨM:
${order.items.map(item => `- ${item.productName} x${item.quantity} - ${formatCurrency(item.price * item.quantity)}`).join('\n')}

💰 Tổng tiền: ${formatCurrency(order.totalAmount)}

💳 Thanh toán: ${paymentMethodText}

🔗 Xem chi tiết: ${process.env.NEXT_PUBLIC_APP_URL || 'https://momeca.vn'}/admin/don-hang
    `.trim();

    // Send email
    const info = await transporter.sendMail({
      from: `"Momeca - Hải Sản" <${GMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: `🔔 Đơn hàng mới #${order.orderNumber} - ${order.customerName}`,
      text: textContent,
      html: htmlContent,
    });

    console.log('Email notification sent successfully:', info.messageId);
    return { success: true, message: 'Email sent', messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email notification:', error);
    return { success: false, message: 'Error sending email' };
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

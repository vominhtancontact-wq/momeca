// Test email notification for new order
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

import { sendNewOrderNotification } from '../src/lib/email';

async function testOrderEmail() {
  console.log('🧪 Testing order email notification...\n');

  const testOrder = {
    orderNumber: 'DH20260123TEST',
    customerName: 'Nguyễn Văn Test',
    customerPhone: '0899630279',
    customerAddress: '123 Đường Test, Quận 1, TP.HCM',
    totalAmount: 500000,
    paymentMethod: 'cod' as const,
    items: [
      {
        productName: 'Tôm hùm baby',
        quantity: 2,
        price: 150000,
      },
      {
        productName: 'Cua hoàng đế',
        quantity: 1,
        price: 200000,
      },
    ],
  };

  console.log('📧 Sending test email to:', process.env.ADMIN_EMAIL || process.env.GMAIL_USER);
  console.log('📦 Test order:', testOrder.orderNumber);
  console.log('');

  const result = await sendNewOrderNotification(testOrder);

  console.log('\n📊 Result:', result);

  if (result.success) {
    console.log('✅ Email sent successfully!');
    console.log('📬 Message ID:', result.messageId);
    console.log('\n💡 Check your inbox:', process.env.ADMIN_EMAIL || process.env.GMAIL_USER);
  } else {
    console.log('❌ Failed to send email');
    console.log('Error:', result.message);
  }
}

testOrderEmail()
  .then(() => {
    console.log('\n✨ Test completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });

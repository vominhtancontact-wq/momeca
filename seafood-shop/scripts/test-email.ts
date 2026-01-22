import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local
config({ path: resolve(__dirname, '../.env.local') });

import { sendNewOrderNotification } from '../src/lib/email';

async function testEmail() {
  console.log('Testing email notification...');
  console.log('GMAIL_USER:', process.env.GMAIL_USER);
  console.log('GMAIL_APP_PASSWORD length:', process.env.GMAIL_APP_PASSWORD?.length);
  console.log('GMAIL_APP_PASSWORD value:', process.env.GMAIL_APP_PASSWORD);
  console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
  
  const result = await sendNewOrderNotification({
    orderNumber: 'DH20260122TEST',
    customerName: 'Nguyễn Văn Test',
    customerPhone: '0899630279',
    customerAddress: '123 Đường Test, Quận 1, TP.HCM',
    totalAmount: 500000,
    paymentMethod: 'online',
    items: [
      {
        productName: 'Tôm sú biển tươi',
        quantity: 2,
        price: 200000,
      },
      {
        productName: 'Cua hoàng đế',
        quantity: 1,
        price: 100000,
      },
    ],
  });

  console.log('Result:', result);
  
  if (result.success) {
    console.log('✅ Email sent successfully!');
    console.log('Check your inbox:', process.env.ADMIN_EMAIL);
  } else {
    console.log('❌ Failed to send email');
    console.log('Error:', result.message);
  }
}

testEmail();

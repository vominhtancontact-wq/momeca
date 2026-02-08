import dbConnect from '../src/lib/db';
import Order from '../src/models/Order';

async function checkOrderUserId() {
  try {
    await dbConnect();
    
    const orders = await Order.find().select('orderNumber userId customerPhone customerName').lean();
    
    console.log('\n=== CHECKING ORDERS ===');
    console.log(`Total orders: ${orders.length}\n`);
    
    const ordersWithUserId = orders.filter(o => o.userId);
    const ordersWithoutUserId = orders.filter(o => !o.userId);
    
    console.log(`Orders WITH userId: ${ordersWithUserId.length}`);
    console.log(`Orders WITHOUT userId: ${ordersWithoutUserId.length}\n`);
    
    if (ordersWithoutUserId.length > 0) {
      console.log('Orders without userId:');
      ordersWithoutUserId.forEach(order => {
        console.log(`- ${order.orderNumber} | ${order.customerName} | ${order.customerPhone}`);
      });
    }
    
    if (ordersWithUserId.length > 0) {
      console.log('\nOrders with userId:');
      ordersWithUserId.slice(0, 5).forEach(order => {
        console.log(`- ${order.orderNumber} | userId: ${order.userId} | ${order.customerName}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkOrderUserId();

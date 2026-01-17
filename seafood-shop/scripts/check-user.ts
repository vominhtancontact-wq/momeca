import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI!;

async function checkUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db!;
    const usersCollection = db.collection('users');

    // Tìm tất cả users
    const users = await usersCollection.find({}).toArray();
    
    console.log(`\nTotal users: ${users.length}\n`);
    
    users.forEach((user: any) => {
      console.log('---');
      console.log('Name:', user.name);
      console.log('Email:', user.email);
      console.log('Phone:', user.phone);
      console.log('Role:', user.role);
      console.log('Created:', user.createdAt);
    });

    // Tìm user có tên hoặc phone liên quan đến "kim thương"
    console.log('\n\n=== Searching for "kim thương" ===');
    const kimThuongUser = await usersCollection.findOne({
      $or: [
        { name: /kim.*thương/i },
        { phone: '0376116162' }
      ]
    });

    if (kimThuongUser) {
      console.log('Found user:', JSON.stringify(kimThuongUser, null, 2));
    } else {
      console.log('No user found with name "kim thương" or phone 0376116162');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUser();

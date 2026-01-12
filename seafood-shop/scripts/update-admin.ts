import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vominhtancontact_db_user:Minhtan3105%4012@cluster0.fortcxc.mongodb.net/seafood-shop?retryWrites=true&w=majority';

const ADMIN_EMAIL = 'admin6868phattrien@momeca.vn';
const ADMIN_PASSWORD = 'momeca.vn!@#$%^6868';

async function updateAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    if (!db) {
      console.error('Database not connected');
      return;
    }
    
    const usersCollection = db.collection('users');

    // Find the user
    const user = await usersCollection.findOne({ email: ADMIN_EMAIL });
    console.log('Found user:', user);

    if (user) {
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

      // Update to admin role and new password
      const result = await usersCollection.updateOne(
        { email: ADMIN_EMAIL },
        { 
          $set: { 
            role: 'admin',
            password: hashedPassword,
            isActive: true
          } 
        }
      );
      console.log('Update result:', result);
      console.log('✅ Updated user to admin role with new password');
    } else {
      // Create new admin
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

      await usersCollection.insertOne({
        name: 'Admin Mỡ Mê Cá',
        email: ADMIN_EMAIL,
        phone: '0900006868',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('✅ Created new admin account');
    }

    console.log('\n=== Admin Credentials ===');
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log('========================\n');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

updateAdmin();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vominhtancontact_db_user:Minhtan3105%4012@cluster0.fortcxc.mongodb.net/seafood-shop?retryWrites=true&w=majority';

// Admin credentials - CHANGE THESE!
const ADMIN_EMAIL = 'admin6868phattrien@momeca.vn';
const ADMIN_PASSWORD = 'momeca.vn!@#$%^6868';
const ADMIN_NAME = 'Admin Mỡ Mê Cá';
const ADMIN_PHONE = '0900006868';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    
    if (existingAdmin) {
      // Update to admin role if not already
      if (existingAdmin.role !== 'admin') {
        await User.updateOne(
          { email: ADMIN_EMAIL },
          { $set: { role: 'admin' } }
        );
        console.log('Updated existing user to admin role');
      } else {
        console.log('Admin account already exists');
      }
    } else {
      // Create new admin
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

      await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        phone: ADMIN_PHONE,
        password: hashedPassword,
        role: 'admin',
        isActive: true,
      });
      console.log('Admin account created successfully!');
    }

    console.log('\n=== Admin Credentials ===');
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log('========================\n');
    console.log('⚠️  Please change the password after first login!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();

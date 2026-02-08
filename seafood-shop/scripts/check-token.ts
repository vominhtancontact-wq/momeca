import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

console.log('JWT_SECRET:', JWT_SECRET);
console.log('\n=== Token Verification Test ===\n');

// Test token (paste your token here from browser localStorage)
const testToken = 'PASTE_YOUR_TOKEN_HERE';

if (testToken === 'PASTE_YOUR_TOKEN_HERE') {
  console.log('❌ Please paste your actual token from browser localStorage');
  console.log('\nTo get your token:');
  console.log('1. Open browser DevTools (F12)');
  console.log('2. Go to Console tab');
  console.log('3. Run: JSON.parse(localStorage.getItem("auth-storage")).state.token');
  console.log('4. Copy the token and paste it in this script');
  process.exit(1);
}

try {
  const decoded = jwt.verify(testToken, JWT_SECRET);
  console.log('✅ Token is valid!');
  console.log('Decoded:', decoded);
} catch (error: any) {
  console.log('❌ Token verification failed!');
  console.log('Error:', error.message);
  
  // Try to decode without verification to see the payload
  try {
    const decoded = jwt.decode(testToken);
    console.log('\nToken payload (unverified):', decoded);
  } catch (e) {
    console.log('Cannot decode token');
  }
}

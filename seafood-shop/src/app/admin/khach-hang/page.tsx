import dbConnect from '@/lib/db';
import User from '@/models/User';
import CustomerListClient from './CustomerListClient';

export const dynamic = 'force-dynamic';

async function getUsers() {
  await dbConnect();
  // Exclude admin users from customer list
  const users = await User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 }).lean();
  return users.map((user: any) => ({
    _id: user._id.toString(),
    name: user.name,
    phone: user.phone,
    email: user.email,
    address: user.address,
    isActive: user.isActive,
    createdAt: user.createdAt.toISOString(),
  }));
}

export default async function AdminCustomersPage() {
  const users = await getUsers();

  return <CustomerListClient users={users} />;
}

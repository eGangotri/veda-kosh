import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import User from '@/models/User';
import { connectToDatabaseVIaMongoose } from '@/utils/mongoose';
import bcrypt from 'bcryptjs';
import { Role } from '@/utils/Utils';

// GET /api/users - Get all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log(`request: ${request?.url}`)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    await connectToDatabaseVIaMongoose();
    const currentUser = await User.findOne({ email: session.user.email });
    
    if (!currentUser || currentUser.role !== Role.Admin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Get all users excluding passwords
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/users - Create a new user (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabaseVIaMongoose();
    const currentUser = await User.findOne({ email: session.user.email });
    if (!currentUser || currentUser.role !== Role.Admin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const { name, email, role, password } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const validRoles = Object.values(Role);
    const finalRole = role && validRoles.includes(role) ? role : Role.User;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    // Determine password: use provided or generate temp
    let tempPassword: string | undefined = undefined;
    let passwordToHash: string;
    if (typeof password === 'string' && password.trim().length > 0) {
      if (password.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
      }
      passwordToHash = password;
    } else {
      tempPassword = Math.random().toString(36).slice(-10) + 'A1!';
      passwordToHash = tempPassword;
    }
    const hashedPassword = await bcrypt.hash(passwordToHash, 12);

    const newUser = await User.create({
      name: String(name).trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      provider: 'credentials',
      role: finalRole,
    });

    const userObj = newUser.toObject();
    delete (userObj as any).password;
    return NextResponse.json({ user: userObj, tempPassword }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

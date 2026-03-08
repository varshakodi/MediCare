import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { verifyPassword, generateToken } from '../../../../lib/auth';
import { validateLogin } from '../../../../models/Patient';

export async function POST(request) {
  try {
    const loginData = await request.json();
    
    // Validate input
    const { error } = validateLogin(loginData);
    if (error) {
      return NextResponse.json(
        { success: false, message: error.details[0].message },
        { status: 400 }
      );
    }
    
    const { email, password } = loginData;
    
    const client = await clientPromise;
    const db = client.db('medicare');
    
    // Find user by email
    const user = await db.collection('patients').findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Verify password
    const isValid = await verifyPassword(password, user.password);
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Generate JWT token
    const token = generateToken(user._id);
    
    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
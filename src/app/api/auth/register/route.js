import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { hashPassword, generatePatientId } from '../../../../lib/auth';
import { validatePatient } from '../../../../models/Patient';

export async function POST(request) {
  try {
    const userData = await request.json();
    
    // Validate input data
    const { error } = validatePatient(userData);
    if (error) {
      return NextResponse.json(
        { success: false, message: error.details[0].message },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db('medicare');
    
    // Check if user already exists
    const existingUser = await db.collection('patients')
      .findOne({ email: userData.email });
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists with this email' },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await hashPassword(userData.password);
    
    // Generate patient ID
    const patientId = await generatePatientId();
    
    // Create user object
    const newUser = {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      patientId,
      age: parseInt(userData.age),
      phone: userData.phone,
      googleId: null,
      profilePicture: null,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      medications: [],
      familyMembers: [],
      emergencyContact: null,
      preferences: {
        notifications: true,
        darkMode: false,
        language: 'en'
      }
    };
    
    // Insert user into database
    const result = await db.collection('patients').insertOne(newUser);
    
    return NextResponse.json({
      success: true,
      message: 'User created successfully. Please login.',
      patientId
    }, { status: 201 });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
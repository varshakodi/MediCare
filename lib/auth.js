import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import clientPromise from './mongodb';

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

export const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const generatePatientId = async () => {
  const client = await clientPromise;
  const db = client.db('medicare');
  
  const lastPatient = await db.collection('patients')
    .findOne({}, { sort: { patientId: -1 } });
  
  if (!lastPatient) return 'P0001';
  
  const lastNumber = parseInt(lastPatient.patientId.substring(1));
  const newNumber = lastNumber + 1;
  return `P${newNumber.toString().padStart(4, '0')}`;
};

export const authenticate = async (request) => {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return null;
    }
    
    const client = await clientPromise;
    const db = client.db('medicare');
    
    const user = await db.collection('patients')
      .findOne({ _id: decoded.userId });
    
    return user;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
};
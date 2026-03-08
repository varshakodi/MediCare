"use client";

import React, { useState, useEffect, createContext, useContext } from 'react';
import { Calendar, Clock, Users, TrendingUp, Bell, Plus, Activity, Heart, Droplets, Moon, Sun, Send, Bot, User, Menu, Download, FileText, LogOut, Eye, EyeOff, AlertTriangle, Phone, X, MessageCircle, CheckCircle, XCircle, Stethoscope } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Authentication Context
const AuthContext = createContext();

// Mock API calls
const authAPI = {
  login: async (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email && password) {
          const user = {
            id: '1',
            name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            email: email,
            patientId: 'P' + Math.floor(Math.random() * 9999).toString().padStart(4, '0'),
            age: 35,
            profilePicture: null,
            createdAt: new Date()
          };
          resolve({ success: true, user, token: 'demo-jwt-token' });
        } else {
          resolve({ success: false, error: 'Invalid credentials' });
        }
      }, 1000);
    });
  },

  register: async (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (userData.email && userData.password && userData.name) {
          resolve({ success: true, message: 'Registration successful! Please login.' });
        } else {
          resolve({ success: false, error: 'All fields are required' });
        }
      }, 1000);
    });
  },

  googleLogin: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = {
          id: '2',
          name: 'John Doe',
          email: 'john.doe@gmail.com',
          patientId: 'P' + Math.floor(Math.random() * 9999).toString().padStart(4, '0'),
          age: 28,
          profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          createdAt: new Date()
        };
        resolve({ success: true, user, token: 'demo-google-jwt-token' });
      }, 1500);
    });
  }
};

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('medicare_user');
    const savedToken = localStorage.getItem('medicare_token');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const result = await authAPI.login(email, password);
    
    if (result.success) {
      setUser(result.user);
      localStorage.setItem('medicare_user', JSON.stringify(result.user));
      localStorage.setItem('medicare_token', result.token);
    }
    
    return result;
  };

  const register = async (userData) => {
    return await authAPI.register(userData);
  };

  const googleLogin = async () => {
    const result = await authAPI.googleLogin();
    
    if (result.success) {
      setUser(result.user);
      localStorage.setItem('medicare_user', JSON.stringify(result.user));
      localStorage.setItem('medicare_token', result.token);
    }
    
    return result;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medicare_user');
    localStorage.removeItem('medicare_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, googleLogin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Login Component
const LoginForm = ({ onSwitchToRegister, darkMode }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, googleLogin } = useAuth();

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    const result = await login(formData.email, formData.password);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const result = await googleLogin();
    if (!result.success) {
      setError('Google login failed. Please try again.');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={`card-auth ${darkMode ? 'dark' : ''}`}>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Activity className="w-8 h-8 text-white" />
        </div>
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>MediCare</h1>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>Sign in to your account</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className={`form-label ${darkMode ? 'text-gray-300' : ''}`}>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-input ${darkMode ? 'dark' : ''}`}
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label className={`form-label ${darkMode ? 'text-gray-300' : ''}`}>Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${darkMode ? 'dark' : ''}`}
              style={{ paddingRight: '3rem' }}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 text-gray-400"
              style={{ transform: 'translateY(-50%)', background: 'none', border: 'none' }}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button onClick={handleSubmit} disabled={loading} className="w-full btn btn-primary">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className={`px-2 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>Or continue with</span>
          </div>
        </div>

        <button onClick={handleGoogleLogin} disabled={loading} className="w-full btn btn-secondary flex items-center justify-center">
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister} className="text-blue-600 font-medium" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            Sign up
          </button>
        </p>
      </div>

      <div className="mt-4 text-center">
        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Demo: Use any email/password to login
        </p>
      </div>
    </div>
  );
};

// Register Component
const RegisterForm = ({ onSwitchToLogin, darkMode }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', age: '', phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const result = await register(formData);
    
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => onSwitchToLogin(), 2000);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className={`card-auth ${darkMode ? 'dark' : ''}`}>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Activity className="w-8 h-8 text-white" />
        </div>
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Join MediCare</h1>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>Create your patient account</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className={`form-label ${darkMode ? 'text-gray-300' : ''}`}>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-input ${darkMode ? 'dark' : ''}`}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label className={`form-label ${darkMode ? 'text-gray-300' : ''}`}>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-input ${darkMode ? 'dark' : ''}`}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`form-label ${darkMode ? 'text-gray-300' : ''}`}>Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className={`form-input ${darkMode ? 'dark' : ''}`}
              placeholder="Age"
              min="1"
              max="120"
              required
            />
          </div>
          <div>
            <label className={`form-label ${darkMode ? 'text-gray-300' : ''}`}>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`form-input ${darkMode ? 'dark' : ''}`}
              placeholder="Phone"
              required
            />
          </div>
        </div>

        <div>
          <label className={`form-label ${darkMode ? 'text-gray-300' : ''}`}>Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${darkMode ? 'dark' : ''}`}
              style={{ paddingRight: '3rem' }}
              placeholder="Create a password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 text-gray-400"
              style={{ transform: 'translateY(-50%)', background: 'none', border: 'none' }}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className={`form-label ${darkMode ? 'text-gray-300' : ''}`}>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`form-input ${darkMode ? 'dark' : ''}`}
            placeholder="Confirm your password"
            required
          />
        </div>

        <button onClick={handleSubmit} disabled={loading} className="w-full btn btn-primary">
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="text-blue-600 font-medium" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

// Mock data
const mockMedications = [
  { id: 1, name: 'Lisinopril', dosage: '10mg', times: ['08:00', '20:00'], taken: [true, false] },
  { id: 2, name: 'Metformin', dosage: '500mg', times: ['08:00', '12:00', '18:00'], taken: [true, true, false] },
  { id: 3, name: 'Atorvastatin', dosage: '20mg', times: ['22:00'], taken: [false] }
];

const mockHealthData = [
  { date: '2025-09-14', bp_systolic: 120, bp_diastolic: 80, cholesterol: 180, weight: 70 },
  { date: '2025-09-15', bp_systolic: 118, bp_diastolic: 78, cholesterol: 175, weight: 69.8 },
  { date: '2025-09-16', bp_systolic: 122, bp_diastolic: 82, cholesterol: 182, weight: 70.2 },
  { date: '2025-09-17', bp_systolic: 119, bp_diastolic: 79, cholesterol: 178, weight: 70.1 },
  { date: '2025-09-18', bp_systolic: 121, bp_diastolic: 81, cholesterol: 176, weight: 69.9 },
  { date: '2025-09-19', bp_systolic: 117, bp_diastolic: 77, cholesterol: 174, weight: 69.7 },
  { date: '2025-09-20', bp_systolic: 120, bp_diastolic: 80, cholesterol: 179, weight: 70.0 }
];

const mockFamilyMembers = [
  { id: 1, name: 'John Smith', relationship: 'Patient', adherence: 85, lastUpdate: '2 hours ago', status: 'Good' },
  { id: 2, name: 'Mary Smith', relationship: 'Spouse', adherence: 92, lastUpdate: '1 hour ago', status: 'Excellent' },
  { id: 3, name: 'Tom Smith', relationship: 'Son', adherence: 78, lastUpdate: '4 hours ago', status: 'Needs Attention' }
];

const mockAppointments = [
  { id: 1, doctor: 'Dr. Sarah Johnson', specialty: 'Cardiologist', date: '2025-09-25', time: '10:00 AM', status: 'Upcoming' },
  { id: 2, doctor: 'Dr. Michael Chen', specialty: 'General Physician', date: '2025-09-28', time: '2:30 PM', status: 'Upcoming' },
  { id: 3, doctor: 'Dr. Emily Davis', specialty: 'Endocrinologist', date: '2025-10-02', time: '11:15 AM', status: 'Scheduled' }
];

// SOS Modal Component
const SOSModal = ({ isOpen, onClose, onConfirm, darkMode, user }) => {
  const [emergencyType, setEmergencyType] = useState('general');
  const [isLoading, setIsLoading] = useState(false);

  const emergencyTypes = [
    { id: 'general', label: 'General Medical Emergency', icon: AlertTriangle },
    { id: 'cardiac', label: 'Heart/Cardiac Emergency', icon: Heart },
    { id: 'breathing', label: 'Breathing Difficulty', icon: Activity },
    { id: 'fall', label: 'Fall or Injury', icon: User },
    { id: 'medication', label: 'Medication Reaction', icon: Droplets }
  ];

  const handleConfirm = async () => {
    setIsLoading(true);
    setTimeout(() => {
      alert(`🚨 EMERGENCY ALERT SENT!\n\nAlert ID: ALERT-${Date.now()}\nPatient: ${user.name}\nType: ${emergencyTypes.find(t => t.id === emergencyType)?.label}\n\nEmergency services have been notified and are en route.\n\nStay calm and wait for assistance.`);
      setIsLoading(false);
      onConfirm();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal-content ${darkMode ? 'dark' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Emergency Alert</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400" style={{ background: 'none', border: 'none' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
            This will immediately alert emergency services and your emergency contacts.
          </p>

          <div className="space-y-2">
            <label className={`form-label ${darkMode ? 'text-white' : 'text-gray-700'}`}>Type of Emergency:</label>
            {emergencyTypes.map(type => {
              const Icon = type.icon;
              return (
                <label key={type.id} className="flex items-center" style={{ cursor: 'pointer' }}>
                  <input
                    type="radio"
                    value={type.id}
                    checked={emergencyType === type.id}
                    onChange={(e) => setEmergencyType(e.target.value)}
                    className="mr-3"
                  />
                  <Icon className="w-4 h-4 mr-2 text-red-500" />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{type.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex space-x-3">
          <button onClick={onClose} disabled={isLoading} className="flex-1 btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleConfirm} disabled={isLoading} className="flex-1 btn btn-danger flex items-center justify-center">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending Alert...
              </>
            ) : (
              <>
                <Phone className="w-4 h-4 mr-2" />
                Send Emergency Alert
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Medicine Tracker Component
const MedicineTracker = ({ darkMode, user }) => {
  const [medications, setMedications] = useState(mockMedications);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const markMedicationTaken = (medId, timeIndex) => {
    setMedications(prev => prev.map(med => {
      if (med.id === medId) {
        const newTaken = [...med.taken];
        newTaken[timeIndex] = true;
        return { ...med, taken: newTaken };
      }
      return med;
    }));
  };

  return (
    <div className={`card ${darkMode ? 'dark' : ''}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center`}>
          <Clock className="mr-2 text-blue-600" />
          Today's Medications for {user.name}
        </h2>
        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Current Time: {currentTime.toLocaleTimeString()}
        </div>
      </div>
      
      <div className="space-y-4">
        {medications.map(med => (
          <div key={med.id} className={`border ${darkMode ? 'border-gray-600' : 'border-gray-200'} rounded-lg p-4`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{med.name}</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{med.dosage}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {med.times.map((time, index) => (
                <div key={index} className={`flex items-center justify-between ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded-md`}>
                  <div className="flex items-center">
                    <span className={`font-medium mr-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{time}</span>
                    {med.taken[index] ? (
                      <span className="status-taken">✓ Taken</span>
                    ) : (
                      <span className="status-pending">Pending</span>
                    )}
                  </div>
                  {!med.taken[index] && (
                    <button
                      onClick={() => markMedicationTaken(med.id, index)}
                      className="btn btn-primary text-sm"
                      style={{ padding: '0.25rem 0.75rem' }}
                    >
                      Mark Taken
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Family Portal Component
const FamilyPortal = ({ darkMode }) => (
  <div className={`card ${darkMode ? 'dark' : ''}`}>
    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-6 flex items-center`}>
      <Users className="mr-2 text-green-600" />
      Family Care Portal
    </h2>
    
    <div className="space-y-4">
      {mockFamilyMembers.map(member => (
        <div key={member.id} className={`border ${darkMode ? 'border-gray-600' : 'border-gray-200'} rounded-lg p-4`}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{member.name}</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{member.relationship}</p>
            </div>
            <div className="text-right">
              <div className={`text-lg font-bold ${member.adherence >= 90 ? 'text-green-600' : member.adherence >= 80 ? 'text-orange-600' : 'text-red-600'}`}>
                {member.adherence}%
              </div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Adherence</p>
            </div>
          </div>
          <div className="mt-3 flex justify-between items-center">
            <span className={`text-sm px-2 py-1 rounded ${
              member.status === 'Excellent' ? 'bg-green-100 text-green-800' :
              member.status === 'Good' ? 'bg-blue-100 text-blue-800' :
              'bg-red-100 text-red-800'
            }`}>
              {member.status}
            </span>
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Updated {member.lastUpdate}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Health Chatbot Component with Gemini AI
const HealthChatbot = ({ darkMode, user }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI Health Assistant powered by Gemini. I can help you with health questions, medication reminders, and general wellness advice. How can I assist you today?", sender: 'bot', timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Initialize Gemini API with better debugging
  const getGeminiResponse = async (message) => {
    try {
      // Debug: Check if API key exists and log first few characters
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      console.log('API Key exists:', !!apiKey);
      console.log('API Key first 10 chars:', apiKey ? apiKey.substring(0, 10) + '...' : 'undefined');
      
      if (!apiKey) {
        return "❌ API key is missing. Please check your .env.local file.";
      }

      if (!apiKey.startsWith('AIza')) {
        return "❌ Invalid API key format. Gemini API keys should start with 'AIza'.";
      }

      console.log('Attempting to import GoogleGenerativeAI...');
      // Dynamic import to avoid SSR issues
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      console.log('GoogleGenerativeAI imported successfully');
      
      console.log('Initializing Gemini API...');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      console.log('Model initialized successfully');

      // Create a health-focused prompt
      const healthPrompt = `You are a helpful AI health assistant for a patient named ${user?.name || 'the user'}. 

IMPORTANT DISCLAIMERS:
- You provide general health information and wellness advice only
- You are NOT a replacement for professional medical advice, diagnosis, or treatment
- Always encourage users to consult healthcare professionals for medical concerns
- Never provide specific medical diagnoses or treatment recommendations
- If someone describes serious symptoms, urge them to seek immediate medical attention

Patient Context:
- Name: ${user?.name || 'Unknown'}
- Patient ID: ${user?.patientId || 'Unknown'}
- Age: ${user?.age || 'Unknown'}

User's question: "${message}"

Provide a helpful, caring response that offers general health guidance while emphasizing the importance of professional medical care when appropriate. Keep responses concise but informative (under 200 words).`;

      console.log('Sending request to Gemini...');
      const result = await model.generateContent(healthPrompt);
      const response = await result.response;
      console.log('Received response from Gemini');
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      // Fallback responses if API fails
      const fallbackResponses = {
        'medication': "I can help with general medication information, but please consult your doctor or pharmacist for specific medication advice.",
        'symptoms': "For any concerning symptoms, please contact your healthcare provider. If this is an emergency, call 911 immediately.",
        'appointment': "I can help you track appointments. Would you like to see your upcoming appointments?",
        'diet': "For personalized nutrition advice, please consult with a registered dietitian or your healthcare provider.",
        'exercise': "Regular exercise is beneficial for health. Consult your doctor before starting any new exercise program.",
        'general': "I'm here to provide general health information. For personalized medical advice, please consult with your healthcare professional."
      };

      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes('medication') || lowerMessage.includes('medicine')) {
        return fallbackResponses.medication;
      } else if (lowerMessage.includes('symptom') || lowerMessage.includes('pain') || lowerMessage.includes('sick')) {
        return fallbackResponses.symptoms;
      } else if (lowerMessage.includes('appointment')) {
        return fallbackResponses.appointment;
      } else if (lowerMessage.includes('diet') || lowerMessage.includes('nutrition')) {
        return fallbackResponses.diet;
      } else if (lowerMessage.includes('exercise') || lowerMessage.includes('fitness')) {
        return fallbackResponses.exercise;
      } else {
        return "I'm sorry, I'm having trouble connecting to my AI service right now. Please try again in a moment.";
      }
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await getGeminiResponse(currentMessage);
      
      const botResponse = {
        id: Date.now() + 1,
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorResponse = {
        id: Date.now() + 1,
        text: "I apologize, but I'm experiencing technical difficulties. Please try again later or contact your healthcare provider for urgent medical questions.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickQuestions = [
    "How can I improve my sleep?",
    "What should I know about my medications?",
    "Tips for healthy eating",
    "When should I see a doctor?"
  ];

  const askQuickQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <div className={`card ${darkMode ? 'dark' : ''}`}>
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-6 flex items-center`}>
        <Bot className="mr-2 text-purple-600" />
        AI Health Assistant (Powered by Gemini)
      </h2>
      
      {/* Quick Questions */}
      <div className="mb-4">
        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>Quick questions:</p>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => askQuickQuestion(question)}
              className={`text-xs px-3 py-1 rounded-full border ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              } transition-colors`}
              style={{ background: 'none' }}
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      <div className={`border ${darkMode ? 'border-gray-600' : 'border-gray-200'} rounded-lg h-96 flex flex-col`}>
        <div className="flex-1 p-4 overflow-auto space-y-3">
          {messages.map(message => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className={`border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'} p-4`}>
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isTyping && sendMessage()}
              className={`flex-1 form-input ${darkMode ? 'dark' : ''}`}
              placeholder="Ask about health, medications, symptoms..."
              disabled={isTyping}
            />
            <button 
              onClick={sendMessage} 
              disabled={isTyping || !inputMessage.trim()}
              className="btn btn-primary flex items-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          
          {/* Health Disclaimer */}
          <div className={`mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center`}>
            This AI provides general health information only. Always consult healthcare professionals for medical advice.
          </div>
        </div>
      </div>
    </div>
  );
};

// Health Charts Component
const HealthCharts = ({ darkMode }) => {
  const pieData = [
    { name: 'Taken', value: 75, fill: '#16a34a' },
    { name: 'Missed', value: 15, fill: '#dc2626' },
    { name: 'Pending', value: 10, fill: '#ea580c' }
  ];

  return (
    <div className={`card ${darkMode ? 'dark' : ''}`}>
      <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-6 flex items-center`}>
        <TrendingUp className="mr-2 text-indigo-600" />
        Health Trends & Analytics
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Blood Pressure Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mockHealthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="bp_systolic" stroke="#2563eb" strokeWidth={2} name="Systolic" />
              <Line type="monotone" dataKey="bp_diastolic" stroke="#dc2626" strokeWidth={2} name="Diastolic" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Medication Adherence</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={60}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Weight Tracking</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockHealthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="weight" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Key Health Metrics</h3>
          <div className="space-y-3">
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex justify-between">
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Avg Blood Pressure</span>
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>119/79</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex justify-between">
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Avg Cholesterol</span>
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>177 mg/dL</span>
              </div>
            </div>
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex justify-between">
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Current Weight</span>
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>70.0 kg</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Appointment Manager Component
const AppointmentManager = ({ darkMode }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [appointments, setAppointments] = useState(mockAppointments);
  const [newAppointment, setNewAppointment] = useState({
    doctor: '', specialty: '', date: '', time: ''
  });

  const addAppointment = () => {
    if (newAppointment.doctor && newAppointment.date && newAppointment.time) {
      const appointment = {
        id: Date.now(),
        ...newAppointment,
        status: 'Scheduled'
      };
      setAppointments([...appointments, appointment]);
      setNewAppointment({ doctor: '', specialty: '', date: '', time: '' });
      setShowAddForm(false);
    }
  };

  return (
    <div className={`card ${darkMode ? 'dark' : ''}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center`}>
          <Calendar className="mr-2 text-blue-600" />
          Appointments
        </h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Schedule New
        </button>
      </div>

      {showAddForm && (
        <div className={`border ${darkMode ? 'border-gray-600' : 'border-gray-200'} rounded-lg p-4 mb-6`}>
          <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Schedule New Appointment</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Doctor Name"
              value={newAppointment.doctor}
              onChange={(e) => setNewAppointment({...newAppointment, doctor: e.target.value})}
              className={`form-input ${darkMode ? 'dark' : ''}`}
            />
            <input
              type="text"
              placeholder="Specialty"
              value={newAppointment.specialty}
              onChange={(e) => setNewAppointment({...newAppointment, specialty: e.target.value})}
              className={`form-input ${darkMode ? 'dark' : ''}`}
            />
            <input
              type="date"
              value={newAppointment.date}
              onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
              className={`form-input ${darkMode ? 'dark' : ''}`}
            />
            <input
              type="time"
              value={newAppointment.time}
              onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
              className={`form-input ${darkMode ? 'dark' : ''}`}
            />
          </div>
          <div className="flex space-x-3 mt-4">
            <button onClick={addAppointment} className="btn btn-primary">
              Schedule
            </button>
            <button onClick={() => setShowAddForm(false)} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {appointments.map(appointment => (
          <div key={appointment.id} className={`border ${darkMode ? 'border-gray-600' : 'border-gray-200'} rounded-lg p-4`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{appointment.doctor}</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{appointment.specialty}</p>
                <div className="flex items-center mt-2">
                  <Calendar className="w-4 h-4 mr-1 text-blue-600" />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {appointment.date} at {appointment.time}
                  </span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                appointment.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
              }`}>
                {appointment.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('medications');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSOSModal, setShowSOSModal] = useState(false);

  const menuItems = [
    { id: 'medications', label: 'Medications', icon: Clock },
    { id: 'family', label: 'Family Portal', icon: Users },
    { id: 'chatbot', label: 'Health Assistant', icon: Bot },
    { id: 'charts', label: 'Health Trends', icon: TrendingUp },
    { id: 'appointments', label: 'Appointments', icon: Calendar }
  ];

  const getPageTitle = () => {
    const currentItem = menuItems.find(item => item.id === activeTab);
    return currentItem ? currentItem.label : 'Dashboard';
  };

  return (
    <>
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} flex`}>
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} sidebar ${darkMode ? 'dark' : ''} sidebar-transition`}>
          <div className="sidebar-header">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  MediCare
                </h1>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                style={{ background: 'none', border: 'none' }}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Emergency SOS Button */}
          <div className="p-4">
            <button
              onClick={() => setShowSOSModal(true)}
              className={`w-full emergency-btn flex items-center ${sidebarOpen ? 'px-4' : 'px-2'} py-3 rounded-lg font-medium shadow-lg`}
              title="Emergency SOS - Send immediate alert"
            >
              <AlertTriangle className={`w-5 h-5 ${sidebarOpen ? 'mr-3' : 'mx-auto'} animate-pulse`} />
              {sidebarOpen && <span className="font-semibold">Emergency SOS</span>}
            </button>
            {sidebarOpen && (
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1 text-center`}>
                For medical emergencies only
              </p>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="sidebar-nav">
            <div className="space-y-2">
              {menuItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`nav-item ${activeTab === item.id ? 'active' : ''} ${sidebarOpen ? '' : 'collapsed'}`}
                  >
                    <Icon className="w-5 h-5" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="sidebar-footer">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <div className="flex items-center space-x-3">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt="Profile" className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Patient ID: {user.patientId}</p>
                  </div>
                </div>
              )}
              {!sidebarOpen && (
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mx-auto">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          {/* Top Header */}
          <header className={`main-header ${darkMode ? 'dark' : ''}`}>
            <div className="px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {getPageTitle()}
                  </h1>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                    Welcome back, {user.name} • {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`p-2 rounded-full transition-colors ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
                    style={{ border: 'none' }}
                  >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                  <button className={`p-2 rounded-full transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} style={{ border: 'none', background: 'none' }}>
                    <Bell className="w-5 h-5" />
                  </button>
                  <button
                    onClick={logout}
                    className={`p-2 rounded-full transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    title="Logout"
                    style={{ border: 'none', background: 'none' }}
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="main-body">
            <div className="max-w-7xl mx-auto">
              {activeTab === 'medications' && <MedicineTracker darkMode={darkMode} user={user} />}
              {activeTab === 'family' && <FamilyPortal darkMode={darkMode} />}
              {activeTab === 'chatbot' && <HealthChatbot darkMode={darkMode} />}
              {activeTab === 'charts' && <HealthCharts darkMode={darkMode} />}
              {activeTab === 'appointments' && <AppointmentManager darkMode={darkMode} />}
            </div>
          </main>
        </div>
      </div>

      {/* SOS Confirmation Modal */}
      <SOSModal
        isOpen={showSOSModal}
        onClose={() => setShowSOSModal(false)}
        onConfirm={() => setShowSOSModal(false)}
        user={user}
        darkMode={darkMode}
      />
    </>
  );
};

// Main App Component
const App = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Loading MediCare...</h1>
        </div>
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} flex items-center justify-center p-4`}>
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <div></div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full transition-colors ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-600'} shadow-md`}
            style={{ border: 'none' }}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        
        {showLogin ? (
          <LoginForm 
            onSwitchToRegister={() => setShowLogin(false)} 
            darkMode={darkMode}
          />
        ) : (
          <RegisterForm 
            onSwitchToLogin={() => setShowLogin(true)} 
            darkMode={darkMode}
          />
        )}
      </div>
    </div>
  );
};

// Main Component with Auth Provider
const MediCareApp = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default MediCareApp;
import Joi from 'joi';

export const PatientSchema = {
  _id: "ObjectId",
  name: "String",
  email: "String",         // unique
  password: "String",      // hashed
  patientId: "String",     // unique (P0001, P0002, etc.)
  age: "Number",
  phone: "String",
  googleId: "String",      // for Google OAuth
  profilePicture: "String",
  emailVerified: "Boolean",
  createdAt: "Date",
  updatedAt: "Date",
  medications: "Array",
  familyMembers: "Array",
  emergencyContact: {
    name: "String",
    phone: "String",
    relationship: "String"
  },
  preferences: {
    notifications: "Boolean",
    darkMode: "Boolean",
    language: "String"
  }
};

export const validatePatient = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    age: Joi.number().min(1).max(120).required(),
    phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).required()
  });
  
  return schema.validate(data);
};

export const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(1).required()
  });
  
  return schema.validate(data);
};
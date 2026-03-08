import { v4 as uuidv4 } from 'uuid';

export const EmergencyAlertSchema = {
  _id: "ObjectId",
  alertId: "String",              // Unique alert ID
  patientId: "String",            // Reference to patient
  patientObjectId: "ObjectId",    // MongoDB ObjectId reference
  emergencyType: "String",        // general, cardiac, breathing, fall, medication
  severity: "String",             // low, medium, high, critical
  status: "String",               // pending, acknowledged, dispatched, resolved, cancelled
  location: {
    latitude: "Number",
    longitude: "Number", 
    address: "String",
    accuracy: "Number"
  },
  patientSnapshot: {
    name: "String",
    age: "Number",
    medicalConditions: "Array",
    currentMedications: "Array",
    allergies: "Array",
    emergencyContact: "Object"
  },
  notifications: "Array",
  auditLog: "Array",
  createdAt: "Date",
  updatedAt: "Date",
  resolvedAt: "Date"
};

export const generateAlertId = () => {
  return `ALERT-${Date.now()}-${uuidv4().substring(0, 8)}`;
};
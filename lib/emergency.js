import { generateAlertId } from '../models/EmergencyAlert.js';
import clientPromise from './mongodb.js';

export const createEmergencyAlert = async (patientId, emergencyData) => {
  try {
    const client = await clientPromise;
    const db = client.db('medicare');
    
    const patient = await db.collection('patients').findOne({ patientId });
    if (!patient) {
      throw new Error('Patient not found');
    }
    
    const alertId = generateAlertId();
    
    const emergencyAlert = {
      alertId,
      patientId,
      patientObjectId: patient._id,
      emergencyType: emergencyData.emergencyType,
      severity: emergencyData.severity || 'medium',
      status: 'pending',
      location: emergencyData.location || null,
      patientSnapshot: {
        name: patient.name,
        age: patient.age,
        medicalConditions: patient.medicalConditions || [],
        currentMedications: patient.medications || [],
        allergies: patient.allergies || [],
        emergencyContact: patient.emergencyContact || null
      },
      notifications: [],
      auditLog: [{
        action: 'created',
        timestamp: new Date(),
        actor: 'system',
        details: `Emergency alert created for ${emergencyData.emergencyType}`
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('emergencyAlerts').insertOne(emergencyAlert);
    
    return {
      success: true,
      alertId,
      mongoId: result.insertedId
    };
    
  } catch (error) {
    console.error('Error creating emergency alert:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const updateAlertStatus = async (alertId, status, details = null) => {
  try {
    const client = await clientPromise;
    const db = client.db('medicare');
    
    const updateData = {
      status,
      updatedAt: new Date(),
      $push: {
        auditLog: {
          action: status,
          timestamp: new Date(),
          actor: 'system',
          details: details || `Status updated to ${status}`
        }
      }
    };
    
    if (status === 'resolved') {
      updateData.resolvedAt = new Date();
    }
    
    const result = await db.collection('emergencyAlerts').updateOne(
      { alertId },
      updateData
    );
    
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error updating alert status:', error);
    return false;
  }
};
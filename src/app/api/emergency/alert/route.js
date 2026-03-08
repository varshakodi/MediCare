import { NextResponse } from 'next/server';
import { createEmergencyAlert } from '../../../../lib/emergency';
import { authenticate } from '../../../../lib/auth';

export async function POST(request) {
  try {
    // Authenticate user (in production)
    // const user = await authenticate(request);
    // if (!user) {
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    // }
    
    const emergencyData = await request.json();
    
    // Validate emergency data
    if (!emergencyData.emergencyType) {
      return NextResponse.json(
        { success: false, message: 'Emergency type is required' },
        { status: 400 }
      );
    }
    
    // For demo, use provided patientId or default
    const patientId = emergencyData.patientId || 'P0001';
    
    // Create emergency alert
    const alertResult = await createEmergencyAlert(patientId, emergencyData);
    
    if (!alertResult.success) {
      return NextResponse.json(
        { success: false, message: alertResult.error },
        { status: 500 }
      );
    }
    
    // In production, send real notifications here
    console.log('🚨 Emergency Alert Created:', alertResult.alertId);
    
    return NextResponse.json({
      success: true,
      alertId: alertResult.alertId,
      message: 'Emergency alert sent successfully',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Emergency alert error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send emergency alert' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Get recent emergency alerts for testing
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId') || 'P0001';
    
    const client = await clientPromise;
    const db = client.db('medicare');
    
    const alerts = await db.collection('emergencyAlerts')
      .find({ patientId })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();
    
    return NextResponse.json({
      success: true,
      alerts
    });
    
  } catch (error) {
    console.error('Error retrieving alerts:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve alerts' },
      { status: 500 }
    );
  }
}
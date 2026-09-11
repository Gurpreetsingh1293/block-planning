/**
 * Test optimization endpoint with minimal data
 */

const fetch = require('node-fetch');

const testData = {
  maintenanceTasks: [
    {
      taskId: 'TEST-001',
      department: 'Engineering',
      location: 'Delhi-Mathura KM 42',
      defect: 'Track repair needed',
      criticality: 'Critical',
      urgency: 'Emergency',
      estimatedDuration: 2,
      requiredWorkers: 5,
      requiredEquipment: ['Tamping Machine']
    }
  ],
  passengerTrains: [
    {
      trainNumber: '12345',
      trainName: 'Test Express',
      stations: [
        { departureTime: '10:00' },
        { arrivalTime: '12:00' }
      ]
    }
  ],
  goodsTrains: [
    {
      trainNumber: 'GF-001',
      expectedDeparture: '11:00',
      expectedArrival: '13:00'
    }
  ],
  corridorAvailability: [
    {
      corridorId: 'C-01',
      availableFrom: '22:00',
      availableUntil: '02:00',
      trafficDensity: 'Low'
    }
  ],
  corridorInfo: {
    corridorId: 'C-01',
    name: 'Delhi-Mathura Main Corridor'
  }
};

async function testOptimize() {
  console.log('🧪 Testing /api/ai/optimize-schedule endpoint...\n');
  
  try {
    const response = await fetch('http://localhost:5000/api/ai/optimize-schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    console.log('Status:', response.status, response.statusText);
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('\n✅ Success!');
      console.log('Optimized Blocks:', result.data.optimizedBlocks?.length || 0);
      console.log('\nFull Response:');
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.error('\n❌ Error:', result.error);
      console.error('Full Response:', JSON.stringify(result, null, 2));
    }
    
  } catch (error) {
    console.error('\n❌ Request failed:', error.message);
  }
}

testOptimize();

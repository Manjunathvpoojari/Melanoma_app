// JavaScript Example: Reading Entities
// Filterable fields: full_name, date_of_birth, gender, medical_record_number, phone, email, notes
async function fetchPatientEntities() {
    const response = await fetch(`https://app.base44.com/api/apps/693e6c3ad53e5ef93df3df50/entities/Patient`, {
        headers: {
            'api_key': '2513c57f74f64c8d952178a552d0acc3', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    console.log(data);
}

// JavaScript Example: Updating an Entity
// Filterable fields: full_name, date_of_birth, gender, medical_record_number, phone, email, notes
async function updatePatientEntity(entityId, updateData) {
    const response = await fetch(`https://app.base44.com/api/apps/693e6c3ad53e5ef93df3df50/entities/Patient/${entityId}`, {
        method: 'PUT',
        headers: {
            'api_key': '2513c57f74f64c8d952178a552d0acc3', // or use await User.me() to get the API key
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
    });
    const data = await response.json();
    console.log(data);
}
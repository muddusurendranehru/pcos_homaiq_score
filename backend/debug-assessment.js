require('dotenv').config();
const db = require('./config/database');

async function debugLatestAssessment() {
    try {
        console.log('🔍 Checking latest assessment data...\n');
        
        // Get the most recent assessment
        const result = await db.query(`
            SELECT * FROM pcos_assessments 
            ORDER BY created_at DESC 
            LIMIT 1
        `);
        
        if (result.rows.length === 0) {
            console.log('No assessments found');
            return;
        }
        
        const assessment = result.rows[0];
        console.log('Latest assessment ID:', assessment.id);
        console.log('Created at:', assessment.created_at);
        console.log('Patient name:', assessment.patient_name);
        console.log('Referring doctor:', assessment.referring_doctor);
        
        // Count non-null fields
        let nonNullCount = 0;
        let nullCount = 0;
        
        console.log('\n📊 Field Analysis:');
        console.log('==================');
        
        Object.keys(assessment).forEach(key => {
            const value = assessment[key];
            if (value !== null && value !== undefined) {
                nonNullCount++;
                console.log(`✅ ${key}: ${value}`);
            } else {
                nullCount++;
                console.log(`❌ ${key}: NULL`);
            }
        });
        
        console.log('\n📈 Summary:');
        console.log(`✅ Non-null fields: ${nonNullCount}`);
        console.log(`❌ Null fields: ${nullCount}`);
        console.log(`📊 Total fields: ${nonNullCount + nullCount}`);
        
        if (nonNullCount === 20) {
            console.log('\n🎯 Confirmed: Only 20 parameters saved');
            console.log('💡 This suggests frontend is not sending all fields');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        process.exit(0);
    }
}

debugLatestAssessment();

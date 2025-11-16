require('dotenv').config();
const db = require('./config/database');

async function checkColumns() {
    try {
        const result = await db.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'pcos_assessments' 
            AND column_name IN ('patient_name', 'referring_doctor')
        `);
        
        console.log('Found columns:', result.rows.map(r => r.column_name));
        
        if (result.rows.length === 0) {
            console.log('❌ patient_name and referring_doctor columns do NOT exist');
            console.log('Need to add these columns to the database');
        } else {
            console.log('✅ Columns exist');
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        process.exit(0);
    }
}

checkColumns();

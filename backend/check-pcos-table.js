require('dotenv').config();
const db = require('./config/database');

async function checkPCOSTable() {
    try {
        console.log('🔍 Checking PCOS Assessments table structure...\n');
        
        // Check table structure
        const structure = await db.query(`
            SELECT column_name, data_type, is_nullable, column_default 
            FROM information_schema.columns 
            WHERE table_name = 'pcos_assessments' 
            ORDER BY ordinal_position
        `);
        
        console.log('Table columns:');
        structure.rows.forEach(col => {
            console.log(`- ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
        });
        
        // Check if table has any data
        const count = await db.query('SELECT COUNT(*) as total FROM pcos_assessments');
        console.log(`\nTotal records: ${count.rows[0].total}`);
        
        // Check max ID
        const maxId = await db.query('SELECT MAX(id) as max_id FROM pcos_assessments');
        console.log(`Max ID: ${maxId.rows[0].max_id || 'NULL'}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        process.exit(0);
    }
}

checkPCOSTable();

require('dotenv').config();
const db = require('./config/database');

async function addPatientColumns() {
    try {
        console.log('🔧 Adding patient_name and referring_doctor columns...\n');
        
        // Add patient_name column (universal text acceptance)
        console.log('Adding patient_name column...');
        await db.query(`
            ALTER TABLE pcos_assessments 
            ADD COLUMN IF NOT EXISTS patient_name TEXT
        `);
        console.log('✅ patient_name column added');
        
        // Add referring_doctor column (universal text acceptance)
        console.log('Adding referring_doctor column...');
        await db.query(`
            ALTER TABLE pcos_assessments 
            ADD COLUMN IF NOT EXISTS referring_doctor TEXT
        `);
        console.log('✅ referring_doctor column added');
        
        // Verify columns were added
        console.log('\nVerifying columns...');
        const result = await db.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'pcos_assessments' 
            AND column_name IN ('patient_name', 'referring_doctor')
            ORDER BY column_name
        `);
        
        console.log('Found columns:');
        result.rows.forEach(col => {
            console.log(`- ${col.column_name}: ${col.data_type}`);
        });
        
        if (result.rows.length === 2) {
            console.log('\n✅ SUCCESS! Both columns added successfully');
            console.log('\nPatient name will accept ANY format:');
            console.log('- lakshmi ✅');
            console.log('- Lakshmi ✅');
            console.log('- mrslakshmi ✅');
            console.log('- mis.lakshmi ✅');
            console.log('- miss.laksh ✅');
            console.log('- Miss..Lak ✅');
            console.log('- lakshmi@g.or ✅');
            console.log('- lakshmi_g ✅');
            console.log('- srivenkatakrishnalakshmi ✅');
            console.log('- S.V.G.K.LAKSHMI ✅');
            console.log('\nReferring doctor will accept ANY format:');
            console.log('- DR ✅');
            console.log('- dr ✅');
            console.log('- Dr.doctor ✅');
            console.log('- mrunal reddy ✅');
            console.log('- DRMRU ✅');
            console.log('- DR.MRU ✅');
            console.log('- dr@mru ✅');
            console.log('- dr_mru ✅');
        } else {
            console.log('❌ Some columns may not have been added properly');
        }
        
    } catch (error) {
        console.error('❌ Error adding columns:', error.message);
    } finally {
        process.exit(0);
    }
}

addPatientColumns();

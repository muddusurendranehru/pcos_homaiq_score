require('dotenv').config();
const db = require('./config/database');

async function checkDatabase() {
    try {
        // Check users table structure
        console.log('=== USERS TABLE STRUCTURE ===');
        const structure = await db.query(`
            SELECT column_name, data_type, is_nullable, column_default 
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            ORDER BY ordinal_position
        `);
        structure.rows.forEach(col => console.log(col));

        // Check if user exists with password hash
        console.log('\n=== USER DATA ===');
        const users = await db.query(`
            SELECT id, email, password_hash IS NOT NULL as has_password, created_at 
            FROM users 
            WHERE email = 'lakshmi@galla.com'
        `);
        users.rows.forEach(user => console.log(user));

        // Test login query
        console.log('\n=== LOGIN TEST QUERY ===');
        const loginTest = await db.query(`
            SELECT id, email, password_hash, name, phone 
            FROM users 
            WHERE email = 'lakshmi@galla.com'
        `);
        console.log('Login query result:', loginTest.rows.length > 0 ? 'User found' : 'User not found');
        if (loginTest.rows.length > 0) {
            const user = loginTest.rows[0];
            console.log('User ID:', user.id);
            console.log('Email:', user.email);
            console.log('Has password hash:', !!user.password_hash);
            console.log('Full name:', user.name);
            console.log('Phone:', user.phone);
        }

    } catch (error) {
        console.error('Database test error:', error);
    } finally {
        process.exit(0);
    }
}

checkDatabase();

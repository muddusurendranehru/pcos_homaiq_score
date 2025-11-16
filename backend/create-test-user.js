require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function createTestUser() {
    try {
        const email = 'test@test.com';
        const password = 'test123';
        const name = 'Test User';
        const phone = '+91-1234567890';
        
        // Check if user already exists
        const existingUser = await db.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );
        
        if (existingUser.rows.length > 0) {
            console.log('Test user already exists, deleting...');
            await db.query('DELETE FROM users WHERE email = $1', [email]);
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        
        console.log('Creating test user...');
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('Hash:', passwordHash);
        
        // Create user with manual ID (since auto-increment is not set up)
        const result = await db.query(
            'INSERT INTO users (id, email, password_hash, name, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name',
            [3, email, passwordHash, name, phone]
        );
        
        console.log('✅ Test user created:', result.rows[0]);
        
        // Test login immediately
        const isValid = await bcrypt.compare(password, passwordHash);
        console.log('Password verification test:', isValid ? '✅ PASS' : '❌ FAIL');
        
    } catch (error) {
        console.error('Create test user error:', error);
    } finally {
        process.exit(0);
    }
}

createTestUser();

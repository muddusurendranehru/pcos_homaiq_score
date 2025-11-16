require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function createTestUser() {
    try {
        const email = 'test@test.com';
        const password = 'test123';
        const name = 'Test User';
        const phone = '+91-1234567890';
        
        // Delete existing test user if exists
        await db.query('DELETE FROM users WHERE email = $1', [email]);
        console.log('Deleted existing test user if any...');
        
        // Get next available ID
        const maxIdResult = await db.query('SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM users');
        const nextId = maxIdResult.rows[0].next_id;
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        
        // Create user with integer ID and 'name' column
        const result = await db.query(
            'INSERT INTO users (id, email, password_hash, name, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name',
            [nextId, email, passwordHash, name, phone]
        );
        
        console.log('✅ Test user created successfully:');
        console.log('   ID:', result.rows[0].id);
        console.log('   Email:', email);
        console.log('   Password:', password);
        console.log('   Name:', result.rows[0].name);
        
        // Test password verification
        const isValid = await bcrypt.compare(password, passwordHash);
        console.log('   Password test:', isValid ? '✅ PASS' : '❌ FAIL');
        
        console.log('\n🧪 Test login with:');
        console.log('   Email: test@test.com');
        console.log('   Password: test123');
        
    } catch (error) {
        console.error('❌ Error creating test user:', error.message);
    } finally {
        process.exit(0);
    }
}

createTestUser();

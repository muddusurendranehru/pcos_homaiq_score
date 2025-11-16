require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function createTestUserAndTest() {
    try {
        console.log('🔧 Creating test user for login testing...\n');
        
        const email = 'test@test.com';
        const password = 'test123';
        const name = 'Test User';
        const phone = '+91-1234567890';
        
        // Delete existing test user if exists
        await db.query('DELETE FROM users WHERE email = $1', [email]);
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        
        // Get next available ID
        const maxIdResult = await db.query('SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM users');
        const nextId = maxIdResult.rows[0].next_id;
        
        // Create test user
        const result = await db.query(
            'INSERT INTO users (id, email, password_hash, name, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name',
            [nextId, email, passwordHash, name, phone]
        );
        
        console.log('✅ Test user created successfully:');
        console.log('   Email:', email);
        console.log('   Password:', password);
        console.log('   ID:', result.rows[0].id);
        console.log('   Name:', result.rows[0].name);
        
        // Verify password works
        const isValid = await bcrypt.compare(password, passwordHash);
        console.log('   Password verification:', isValid ? '✅ PASS' : '❌ FAIL');
        
        console.log('\n🧪 Now test login with these credentials:');
        console.log('   Email: test@test.com');
        console.log('   Password: test123');
        
        console.log('\n📋 PowerShell command to test:');
        console.log('$body = @{email="test@test.com"; password="test123"} | ConvertTo-Json');
        console.log('Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        process.exit(0);
    }
}

createTestUserAndTest();

require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function testSignupFlow() {
    try {
        console.log('🧪 Testing SIGNUP flow directly...\n');
        
        const email = 'dryrun@test.com';
        const password = 'test123';
        const fullName = 'Dry Run User';
        const phone = '+91-9876543210';
        
        // Step 1: Check if user exists
        console.log('Step 1: Checking if user exists...');
        const userExists = await db.query('SELECT id FROM users WHERE email = $1', [email]);
        
        if (userExists.rows.length > 0) {
            console.log('User exists, deleting for clean test...');
            await db.query('DELETE FROM users WHERE email = $1', [email]);
        }
        
        // Step 2: Get next ID
        console.log('Step 2: Getting next available ID...');
        const maxIdResult = await db.query('SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM users');
        const nextId = maxIdResult.rows[0].next_id;
        console.log('Next ID:', nextId);
        
        // Step 3: Hash password
        console.log('Step 3: Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        console.log('Password hashed successfully');
        
        // Step 4: Insert user
        console.log('Step 4: Inserting user...');
        const result = await db.query(
            `INSERT INTO users (id, email, password_hash, name, phone) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING id, email, name, phone, created_at`,
            [nextId, email, passwordHash, fullName, phone]
        );
        
        console.log('✅ SIGNUP SUCCESS!');
        console.log('User created:', result.rows[0]);
        
        // Step 5: Test login immediately
        console.log('\nStep 5: Testing login with new user...');
        const loginResult = await db.query(
            'SELECT id, email, password_hash, name, phone FROM users WHERE email = $1',
            [email]
        );
        
        if (loginResult.rows.length === 0) {
            console.log('❌ User not found for login');
            return;
        }
        
        const user = loginResult.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        
        if (isPasswordValid) {
            console.log('✅ LOGIN SUCCESS!');
            console.log('User data:', {
                id: user.id,
                email: user.email,
                fullName: user.name,
                phone: user.phone
            });
        } else {
            console.log('❌ LOGIN FAILED - Password mismatch');
        }
        
    } catch (error) {
        console.error('❌ ERROR:', error.message);
        console.error('Full error:', error);
    } finally {
        process.exit(0);
    }
}

testSignupFlow();

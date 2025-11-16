require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function testPassword() {
    try {
        // Get the stored password hash
        const result = await db.query(
            'SELECT password_hash FROM users WHERE email = $1',
            ['lakshmi@galla.com']
        );
        
        if (result.rows.length === 0) {
            console.log('User not found');
            return;
        }
        
        const storedHash = result.rows[0].password_hash;
        console.log('Stored hash:', storedHash);
        
        // Test different passwords
        const testPasswords = ['test123', 'password', 'lakshmi123', '123456'];
        
        for (const password of testPasswords) {
            const isValid = await bcrypt.compare(password, storedHash);
            console.log(`Password "${password}": ${isValid ? '✅ VALID' : '❌ Invalid'}`);
        }
        
    } catch (error) {
        console.error('Password test error:', error);
    } finally {
        process.exit(0);
    }
}

testPassword();

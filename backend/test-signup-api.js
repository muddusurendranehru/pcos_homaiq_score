require('dotenv').config();
const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./config/database');

// Test the exact signup logic
async function testSignupAPI() {
    try {
        console.log('🧪 Testing SIGNUP API logic...\n');
        
        // Simulate request body
        const req = {
            body: {
                email: 'apitest@test.com',
                password: 'test123',
                confirmPassword: 'test123',
                fullName: 'API Test User',
                phone: '+91-9876543210'
            }
        };
        
        console.log('Request body:', req.body);
        
        // Step 1: Validation (simulate)
        console.log('\nStep 1: Validation...');
        const { email, password, fullName, phone } = req.body;
        
        if (!email || !password) {
            console.log('❌ Missing required fields');
            return;
        }
        
        if (password !== req.body.confirmPassword) {
            console.log('❌ Password confirmation mismatch');
            return;
        }
        
        console.log('✅ Validation passed');
        
        // Step 2: Check if user exists
        console.log('\nStep 2: Checking if user exists...');
        const userExists = await db.query('SELECT id FROM users WHERE email = $1', [email]);
        
        if (userExists.rows.length > 0) {
            console.log('❌ User already exists');
            // Delete for test
            await db.query('DELETE FROM users WHERE email = $1', [email]);
            console.log('Deleted existing user for test');
        }
        
        // Step 3: Hash password
        console.log('\nStep 3: Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        console.log('✅ Password hashed');
        
        // Step 4: Get next ID
        console.log('\nStep 4: Getting next ID...');
        const maxIdResult = await db.query('SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM users');
        const nextId = maxIdResult.rows[0].next_id;
        console.log('Next ID:', nextId);
        
        // Step 5: Insert user
        console.log('\nStep 5: Creating user...');
        const result = await db.query(
            `INSERT INTO users (id, email, password_hash, name, phone) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING id, email, name, phone, created_at`,
            [nextId, email, passwordHash, fullName || null, phone || null]
        );
        
        const user = result.rows[0];
        console.log('✅ User created:', user);
        
        // Step 6: Generate JWT
        console.log('\nStep 6: Generating JWT...');
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        console.log('✅ JWT generated');
        
        // Step 7: Response
        const response = {
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.name,
                phone: user.phone,
                createdAt: user.created_at
            }
        };
        
        console.log('\n✅ SIGNUP API LOGIC SUCCESS!');
        console.log('Response:', JSON.stringify(response, null, 2));
        
    } catch (error) {
        console.error('\n❌ SIGNUP API LOGIC FAILED!');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        process.exit(0);
    }
}

testSignupAPI();

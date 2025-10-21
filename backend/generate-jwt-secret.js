#!/usr/bin/env node

/**
 * JWT Secret Generator
 * Generates a cryptographically secure random string for JWT authentication
 */

const crypto = require('crypto');

console.log('\n🔐 JWT Secret Generator\n');
console.log('='.repeat(80));

// Generate 3 different secrets for comparison
console.log('\nOption 1 (64 characters):');
const secret1 = crypto.randomBytes(32).toString('hex');
console.log(secret1);

console.log('\nOption 2 (64 characters):');
const secret2 = crypto.randomBytes(32).toString('hex');
console.log(secret2);

console.log('\nOption 3 (Base64, 44 characters):');
const secret3 = crypto.randomBytes(32).toString('base64');
console.log(secret3);

console.log('\n' + '='.repeat(80));
console.log('\n✅ Copy any of the above secrets to your .env file');
console.log('   Example: JWT_SECRET=' + secret1);
console.log('\n⚠️  NEVER commit your .env file to Git!');
console.log('💡 For production, generate a NEW secret (don\'t reuse development secret)\n');

// Write to a file for easy copying
const fs = require('fs');
const secretsFile = '.jwt-secrets.txt';
const content = `# Generated JWT Secrets (${new Date().toISOString()})
# Pick one and add to your .env file
# DELETE THIS FILE after copying!

Option 1 (Hex): ${secret1}
Option 2 (Hex): ${secret2}
Option 3 (Base64): ${secret3}

# Usage in .env file:
JWT_SECRET=${secret1}
`;

fs.writeFileSync(secretsFile, content);
console.log(`📝 Secrets also saved to: ${secretsFile}`);
console.log('   (Delete this file after copying!)\n');


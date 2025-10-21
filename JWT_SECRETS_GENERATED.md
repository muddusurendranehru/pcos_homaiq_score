# 🔐 JWT Secrets Generated

Generated on: 2025-10-21

---

## ✅ **Pick ONE of These Secrets:**

### **Option 1: Hex Format (Recommended)**
```
fc7230ab7a185a21e0512be557eadb77786e10edebc5724994b2f5b3937220c7
```

### **Option 2: Hex Format (Alternative)**
```
eefa1dd63d5f1418217064c6852eaa51b6e7d274037f07e8b5370b29c479f5a8
```

### **Option 3: Base64 Format**
```
J1hZH7XsxEvIkCZRtAU4OpH7EX0inOjEquIMrb18Bsg=
```

### **Option 4: First Generated**
```
fdd2998f2f6d737f1cf575b5e039f22484b5bd72699096f983265fdc677b462e
```

---

## 📋 **How to Use:**

### **For Development (.env file):**
```env
JWT_SECRET=fc7230ab7a185a21e0512be557eadb77786e10edebc5724994b2f5b3937220c7
```

### **For Production (Render/Deployment):**
**Generate a NEW secret!** Don't use the same secret as development.

Run this command:
```bash
node backend/generate-jwt-secret.js
```

Or use Node.js directly:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🔒 **Security Best Practices:**

1. ✅ **Use different secrets** for development and production
2. ✅ **Never commit** `.env` files to Git
3. ✅ **Minimum 32 characters** (all options above are 64 characters)
4. ✅ **Rotate secrets** periodically (every 3-6 months)
5. ✅ **Use environment variables** on deployment platforms (Render, Vercel, etc.)

---

## 🚫 **What NOT to Do:**

- ❌ Don't use simple strings like "mysecret123"
- ❌ Don't share secrets publicly (Slack, email, Git)
- ❌ Don't hardcode secrets in source code
- ❌ Don't use the same secret across multiple projects

---

## 🎯 **Your Current Setup:**

```env
# backend/.env
DATABASE_URL=postgresql://neondb_owner:npg_Bl9kug4wxKzN@ep-weathered-paper-a1mbh5zv-pooler.ap-southeast-1.aws.neon.tech/pcos_homaiq_score?sslmode=require

JWT_SECRET=fc7230ab7a185a21e0512be557eadb77786e10edebc5724994b2f5b3937220c7

PORT=5000
NODE_ENV=development
```

---

## 📝 **Generate New Secrets Anytime:**

```bash
# Method 1: Use the generator script
cd backend
node generate-jwt-secret.js

# Method 2: One-liner
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Method 3: PowerShell (Windows)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# Method 4: Online (use trusted sites only)
# https://www.uuidgenerator.net/
```

---

## ✅ **Next Steps:**

1. Copy one of the secrets above
2. Update `backend/.env` file
3. Restart your backend server
4. Test authentication
5. Delete this file (it contains secrets!)

---

**🎉 Your JWT authentication is now secured!**


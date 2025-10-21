# 🔐 ENVIRONMENT VARIABLES SETUP

## ⚠️ **IMPORTANT: Your Database Credentials**

Your Neon PostgreSQL connection string is:
```
postgresql://neondb_owner:npg_Bl9kug4wxKzN@ep-weathered-paper-a1mbh5zv-pooler.ap-southeast-1.aws.neon.tech/pcos_homaiq_score?sslmode=require
```

**NEVER COMMIT THIS TO GIT!**

---

## 🔧 **Setup Instructions**

### **Step 1: Create Backend .env File**

1. Open a text editor (Notepad, VS Code, etc.)
2. Create a new file in the `backend` folder
3. Name it exactly: `.env` (with the dot at the start)
4. Copy and paste this content:

```env
# PCOS HOMA-IQ Score Backend Environment Variables
# NEVER COMMIT THIS FILE TO GIT!

# Neon PostgreSQL Database Connection
DATABASE_URL=postgresql://neondb_owner:npg_Bl9kug4wxKzN@ep-weathered-paper-a1mbh5zv-pooler.ap-southeast-1.aws.neon.tech/pcos_homaiq_score?sslmode=require

# JWT Secret (Generate a new random string for production!)
JWT_SECRET=pcos_homaiq_score_super_secret_jwt_key_2024_secure_random_string

# Server Configuration
PORT=5000
NODE_ENV=development
```

5. **Save the file** as `backend/.env`

---

## ✅ **Verify .gitignore**

Make sure your `.gitignore` file includes:
```
# Environment variables
.env
.env.local
.env.*.local
backend/.env
frontend/.env
```

This prevents accidentally committing secrets to Git!

---

## 🧪 **Test Backend Connection**

After creating the `.env` file:

1. **Kill existing backend process:**
   ```bash
   # Find process on port 5000
   netstat -ano | findstr :5000
   
   # Kill it (replace PID with actual number)
   taskkill /F /PID <PID>
   ```

2. **Start backend:**
   ```bash
   cd backend
   npm run dev
   ```

3. **You should see:**
   ```
   ╔═══════════════════════════════════════════════════════════╗
   ║   🏥  PCOS HOMA-IQ Score API Server                      ║
   ║   📡  Server running on port 5000                        ║
   ║   💚  Database: pcos_homaiq_score (Neon PostgreSQL)      ║
   ╚═══════════════════════════════════════════════════════════╝
   ```

4. **Test health endpoint:**
   Open browser: http://localhost:5000/health
   
   Should return:
   ```json
   {"status":"ok","message":"PCOS HOMA-IQ Score API is running"}
   ```

---

## 🔐 **For Production Deployment (Render):**

When deploying to Render, add these environment variables in the dashboard:

1. Go to: https://render.com/dashboard
2. Select your backend service
3. Go to: **Environment** tab
4. Add:
   ```
   Key: DATABASE_URL
   Value: postgresql://neondb_owner:npg_Bl9kug4wxKzN@ep-weathered-paper-a1mbh5zv-pooler.ap-southeast-1.aws.neon.tech/pcos_homaiq_score?sslmode=require
   
   Key: JWT_SECRET
   Value: [generate a NEW random string - don't use the same as development!]
   
   Key: NODE_ENV
   Value: production
   
   Key: PORT
   Value: 5000
   ```

---

## 🔒 **Security Best Practices:**

1. ✅ **Never commit .env files** to Git
2. ✅ **Use different JWT_SECRET** for production
3. ✅ **Rotate database password** if exposed publicly
4. ✅ **Use environment variables** for all secrets
5. ✅ **Enable connection pooling** in Neon
6. ✅ **Monitor database usage** in Neon dashboard

---

## 🆘 **If You Accidentally Committed Secrets:**

1. **Rotate your database password** in Neon Console
2. **Generate new JWT_SECRET**
3. **Remove from Git history:**
   ```bash
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch backend/.env" \
   --prune-empty --tag-name-filter cat -- --all
   ```
4. **Force push:**
   ```bash
   git push origin --force --all
   ```

---

## ✅ **Checklist:**

- [ ] Created `backend/.env` file
- [ ] Pasted database connection string
- [ ] Set JWT_SECRET
- [ ] Verified `.gitignore` includes `.env`
- [ ] Backend starts successfully
- [ ] Health endpoint works
- [ ] Database connection successful
- [ ] Never committed `.env` to Git

---

**Your backend should now connect to Neon database!** 🎉


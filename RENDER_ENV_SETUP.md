# 🚀 RENDER DEPLOYMENT - Environment Variables

## ⚡ Quick Setup (5 Minutes)

### **1. Backend Service (Node.js)**

Go to: **Render Dashboard → Your Backend Service → Environment**

Add these **4 variables**:

```
NODE_ENV=production

DATABASE_URL=postgresql://neondb_owner:npg_Bl9kug4wxKzN@ep-weathered-paper-a1mbh5zv-pooler.ap-southeast-1.aws.neon.tech/pcos_homaiq_score?sslmode=require

JWT_SECRET=fc7230ab7a185a21e0512be557eadb77786e10edebc5724994b2f5b3937220c7

PORT=5000
```

---

### **2. Frontend Service (React)**

Go to: **Render Dashboard → Your Frontend Service → Environment**

Add **1 variable**:

```
REACT_APP_API_URL=https://your-backend-name.onrender.com
```

Replace `your-backend-name` with your actual backend service URL.

---

## 🔧 Backend Build Settings

```
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

---

## 🎨 Frontend Build Settings

```
Root Directory: frontend
Build Command: npm install && npm run build
Start Command: npx serve -s build -l $PORT
Publish Directory: frontend/build
```

---

## ✅ Deployment Checklist

**Backend:**
- [ ] NODE_ENV = `production`
- [ ] DATABASE_URL = `[your Neon PostgreSQL URL]`
- [ ] JWT_SECRET = `[64-character secret]`
- [ ] PORT = `5000`

**Frontend:**
- [ ] REACT_APP_API_URL = `https://[backend-url].onrender.com`

**After Deploy:**
- [ ] Test backend: `https://your-backend.onrender.com/health`
- [ ] Test frontend: `https://your-frontend.onrender.com`
- [ ] Try login/signup
- [ ] Test PCOS assessment save

---

## 🔒 Security Note

**⚠️ IMPORTANT:** Generate a **NEW** JWT_SECRET for production!

```bash
# Run this command:
node backend/generate-jwt-secret.js

# Use the generated secret in Render (not the one shown above!)
```

---

## 📊 Service Configuration

| Setting | Backend | Frontend |
|---------|---------|----------|
| **Type** | Web Service | Static Site |
| **Runtime** | Node | Node |
| **Build** | `npm install` | `npm install && npm run build` |
| **Start** | `npm start` | `npx serve -s build -l $PORT` |
| **Port** | 5000 | Auto |

---

## 🐛 Troubleshooting

**Backend not starting?**
```bash
# Check logs for:
- Database connection: "✅ Connected to Neon"
- Port binding: "Server running on port 5000"
```

**Frontend can't reach backend?**
```bash
# Verify REACT_APP_API_URL is set correctly
# Check CORS in backend/server.js includes frontend URL
```

**Database connection error?**
```bash
# Verify DATABASE_URL in Render environment
# Check Neon database is active
# Ensure sslmode=require is in connection string
```

---

## 🎯 One-Line Summary

**Backend:** `NODE_ENV=production` + `DATABASE_URL` + `JWT_SECRET` + `PORT=5000`  
**Frontend:** `REACT_APP_API_URL=https://[backend].onrender.com`

**Done! Deploy and test!** 🚀


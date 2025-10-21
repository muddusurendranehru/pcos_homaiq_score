# 🌍 ENVIRONMENT CONFIGURATION GUIDE

## 📊 **Development vs Production**

### **Key Differences:**

| Feature | Development | Production |
|---------|-------------|------------|
| **NODE_ENV** | `development` | `production` |
| **Error Messages** | Detailed stack traces | Generic messages |
| **Performance** | Hot reload, slower | Optimized, faster |
| **Logging** | Console (verbose) | File/Service (minimal) |
| **Database** | Local or dev instance | Production database |
| **JWT Secret** | Simple (for testing) | Strong random (32+ chars) |
| **CORS** | `localhost` allowed | Specific domains only |
| **Caching** | Disabled | Enabled |
| **Minification** | No | Yes |
| **Source Maps** | Yes | No (or external) |

---

## 🖥️ **LOCAL DEVELOPMENT SETUP**

### **backend/.env** (Local)
```env
# PCOS HOMA-IQ Score - DEVELOPMENT Environment
NODE_ENV=development

# Neon PostgreSQL Database
DATABASE_URL=postgresql://neondb_owner:npg_Bl9kug4wxKzN@ep-weathered-paper-a1mbh5zv-pooler.ap-southeast-1.aws.neon.tech/pcos_homaiq_score?sslmode=require

# JWT Secret (Dev - can be simple)
JWT_SECRET=fc7230ab7a185a21e0512be557eadb77786e10edebc5724994b2f5b3937220c7

# Server
PORT=5000
```

### **Why development locally?**
- ✅ **Hot reload:** nodemon auto-restarts on code changes
- ✅ **Detailed errors:** See full stack traces for debugging
- ✅ **Console logging:** See all `console.log()` statements
- ✅ **Faster iteration:** No need to rebuild/redeploy

---

## 🚀 **PRODUCTION DEPLOYMENT**

### **Render Environment Variables** (Production)
```
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=[NEW RANDOM SECRET - DON'T REUSE DEV SECRET]
PORT=5000
```

### **Why production for deployment?**
- ✅ **Performance:** Express runs 3x faster in production mode
- ✅ **Security:** Stack traces hidden from users
- ✅ **Optimization:** Caching, minification enabled
- ✅ **Professional:** Better error handling

---

## 🔄 **How NODE_ENV Affects Your App**

### **Express Behavior:**

```javascript
// In development:
if (process.env.NODE_ENV === 'development') {
  // Show detailed errors
  app.use(errorHandler({ dumpExceptions: true, showStack: true }));
  
  // Verbose logging
  console.log('Database query:', query);
  
  // No caching
  app.disable('view cache');
}

// In production:
if (process.env.NODE_ENV === 'production') {
  // Hide error details
  app.use(errorHandler());
  
  // Minimal logging
  logger.error('Database error');
  
  // Enable caching
  app.enable('view cache');
}
```

### **React Build:**

```bash
# Development build
npm start
# Large bundle, source maps, hot reload

# Production build
npm run build
# Minified, optimized, no source maps
```

---

## 📁 **Recommended Setup**

### **Option 1: Separate .env Files**

```
backend/
├── .env                    # Development (local)
├── .env.production        # Production (copy to server)
└── .env.example           # Template (commit to Git)
```

**backend/.env** (Development)
```env
NODE_ENV=development
DATABASE_URL=postgresql://...dev-instance...
JWT_SECRET=dev_secret_fc7230ab7a185a21...
PORT=5000
```

**backend/.env.production** (Production - DON'T COMMIT!)
```env
NODE_ENV=production
DATABASE_URL=postgresql://...production-instance...
JWT_SECRET=prod_secret_NEW_RANDOM_STRING...
PORT=5000
```

### **Option 2: Use Environment Detection**

```javascript
// backend/config/environment.js
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  isProduction,
  isDevelopment,
  port: process.env.PORT || 5000,
  database: {
    url: process.env.DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
    poolSize: isProduction ? 20 : 5
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: isProduction ? '7d' : '30d'  // Longer tokens in dev
  },
  cors: {
    origin: isDevelopment 
      ? ['http://localhost:3038', 'http://localhost:3000']
      : ['https://pcos-frontend.onrender.com']
  }
};
```

---

## 🔒 **Security Best Practices**

### **✅ DO:**
- Use `NODE_ENV=development` locally
- Use `NODE_ENV=production` on live servers
- Generate **different JWT secrets** for dev and prod
- Use **separate databases** for dev and prod (if possible)
- Enable detailed logging in development
- Disable detailed errors in production

### **❌ DON'T:**
- Use `NODE_ENV=production` during local development
- Use the same JWT secret in dev and prod
- Expose stack traces in production
- Log sensitive data in production
- Use development database in production

---

## 🎯 **Quick Reference**

### **Local Development:**
```bash
# .env file
NODE_ENV=development

# Start backend
cd backend
npm run dev

# Start frontend
cd frontend
npm start
```

### **Production (Render):**
```
Render Dashboard → Environment Variables:
NODE_ENV=production
DATABASE_URL=[production database]
JWT_SECRET=[new random secret]

Build Command: npm install
Start Command: npm start
```

---

## 🔄 **Migration Checklist**

When moving from development to production:

- [ ] Change `NODE_ENV` to `production`
- [ ] Generate new JWT secret
- [ ] Update CORS origins to production domains
- [ ] Use production database connection
- [ ] Disable verbose logging
- [ ] Enable error tracking (Sentry, LogRocket)
- [ ] Set up monitoring (UptimeRobot, etc.)
- [ ] Use HTTPS (Render provides this)
- [ ] Configure rate limiting
- [ ] Set up backups

---

## 🧪 **Testing Both Environments Locally**

### **Test Production Mode:**
```bash
# Temporarily set production mode
cd backend
NODE_ENV=production npm start

# Or in package.json:
{
  "scripts": {
    "dev": "NODE_ENV=development nodemon server.js",
    "start": "NODE_ENV=production node server.js",
    "start:prod-test": "NODE_ENV=production nodemon server.js"
  }
}
```

---

## 📊 **Performance Impact**

### **Express Performance:**
```
Development Mode:
- View rendering: ~5ms
- No caching
- Full error details

Production Mode:
- View rendering: ~0.5ms (10x faster!)
- Aggressive caching
- Generic errors
```

### **React Performance:**
```
Development Build:
- Bundle size: 5-10 MB
- Load time: 2-5 seconds
- Hot reload enabled

Production Build:
- Bundle size: 200-500 KB (minified + gzipped)
- Load time: 0.5-1 second
- Optimized code
```

---

## 🎓 **Summary**

**For LOCAL development:**
```env
NODE_ENV=development  ✅ Correct for your machine!
```

**For PRODUCTION deployment:**
```env
NODE_ENV=production  ✅ Correct for Render/live servers!
```

**Your current setup is CORRECT!**
- ✅ `NODE_ENV=development` in your local `.env` file
- ✅ Will use `NODE_ENV=production` when deploying to Render

---

## 🚀 **Next Steps**

1. **Keep** `NODE_ENV=development` for local work
2. When deploying to Render, **set** `NODE_ENV=production` in dashboard
3. Generate a **new JWT secret** for production
4. Test locally with `NODE_ENV=development`
5. Deploy with `NODE_ENV=production`

**Your setup is perfect for development!** 🎉


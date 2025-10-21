# 🎨 FRONTEND DEPLOYMENT TO RENDER (STATIC SITE)

## 🚀 **Quick Deploy Steps**

### **1. Create New Static Site**
- Go to: https://dashboard.render.com
- Click **"New +"** → **"Static Site"**

### **2. Connect Repository**
- Select: `muddusurendranehru/pcos_homaiq_score`
- Branch: `main`

### **3. Configure Settings**

| Setting | Value |
|---------|-------|
| **Name** | `pcos-homaiq-score-frontend` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `build` |

### **4. Environment Variables**

Add **1 variable**:

```
REACT_APP_API_URL=https://pcos-homaiq-score-backend.onrender.com
```

*(Replace with your actual backend URL)*

### **5. Deploy**
- Click **"Create Static Site"**
- Wait 3-5 minutes
- Your app will be live!

---

## 📋 **DETAILED CONFIGURATION**

### **Service Type: Static Site**
✅ Use "Static Site" (NOT Web Service)
- Cheaper (FREE tier available)
- Faster for React apps
- Serves pre-built HTML/CSS/JS files
- No Node.js server needed in production

### **Root Directory: `frontend`**
Why? Your project structure:
```
pcos_homaiq_score/
├── backend/          ← Backend was deployed from here
├── frontend/         ← Frontend deploys from here!
│   ├── package.json
│   ├── public/
│   └── src/
└── README.md
```

### **Build Command: `npm install && npm run build`**
This command:
1. `npm install` - Installs all dependencies
2. `&&` - Then runs the next command
3. `npm run build` - Creates optimized production build

Creates this folder:
```
frontend/
└── build/              ← Render serves files from here!
    ├── index.html
    ├── static/
    │   ├── css/
    │   └── js/
    └── ...
```

### **Publish Directory: `build`**
Tells Render to serve files from `frontend/build/` directory

### **Environment Variable: REACT_APP_API_URL**
**CRITICAL:** React apps can only access environment variables that start with `REACT_APP_`

This tells your frontend where the backend is:
```javascript
// In your React code:
const API_URL = process.env.REACT_APP_API_URL;
// Results in: https://pcos-homaiq-score-backend.onrender.com
```

---

## 🔧 **TROUBLESHOOTING**

### **Issue 1: Build Fails - "Cannot find package.json"**
**Solution:** Set Root Directory to `frontend`

### **Issue 2: Build Fails - "npm: command not found"**
**Solution:** Render should auto-detect Node.js. Check Build Command is correct.

### **Issue 3: Site Loads but Shows Blank Page**
**Solutions:**
1. Check browser console for errors
2. Verify `REACT_APP_API_URL` is set correctly
3. Check Publish Directory is `build` (not `dist` or `public`)

### **Issue 4: API Calls Fail (CORS Errors)**
**Solution:** Your backend already has CORS enabled. Check:
1. Backend is running (visit health endpoint)
2. `REACT_APP_API_URL` matches your backend URL exactly
3. No trailing slash in the URL

### **Issue 5: "404 Not Found" on Page Refresh**
**Solution:** Add a `_redirects` file in `public/` folder:
```
/*    /index.html   200
```
This is for React Router to work with browser history.

---

## 📊 **EXPECTED BUILD OUTPUT**

```
==> Cloning from GitHub
==> Checking out commit [hash] in branch main
==> Using Node.js version 22.16.0
==> Changing directory to frontend
==> Running build command 'npm install && npm run build'

npm install
added 1500+ packages

npm run build
Creating an optimized production build...
Compiled successfully!

File sizes after gzip:
  50.2 kB  build/static/js/main.abc123.js
  2.1 kB   build/static/css/main.abc123.css

The build folder is ready to be deployed.

==> Build succeeded!
==> Deploying...
==> Your site is live!
    https://pcos-homaiq-score-frontend.onrender.com
```

**Total time: ~3-5 minutes**

---

## ✅ **DEPLOYMENT CHECKLIST**

**Before Deploying:**
- [ ] Backend is live and working
- [ ] You have backend URL (e.g., https://your-backend.onrender.com)
- [ ] Code is pushed to GitHub

**During Deployment:**
- [ ] Selected "Static Site" (not Web Service)
- [ ] Set Root Directory to `frontend`
- [ ] Build Command: `npm install && npm run build`
- [ ] Publish Directory: `build`
- [ ] Added `REACT_APP_API_URL` environment variable
- [ ] Clicked "Create Static Site"

**After Deployment:**
- [ ] Build succeeded (check logs)
- [ ] Site is live (green "Live" badge)
- [ ] Can access frontend URL in browser
- [ ] Login page loads
- [ ] Can signup/login
- [ ] Dashboard loads
- [ ] Can create PCOS assessment
- [ ] Data saves to backend

---

## 🎯 **TESTING YOUR DEPLOYED FRONTEND**

### **Test 1: Site Loads**
```
Visit: https://your-frontend.onrender.com
Expected: Login/Signup page appears
```

### **Test 2: Signup Works**
```
1. Click "Sign Up"
2. Enter email, password, confirm password
3. Click submit
Expected: Redirects to login or dashboard
```

### **Test 3: Login Works**
```
1. Enter email and password
2. Click login
Expected: Redirects to dashboard
```

### **Test 4: Dashboard Loads**
```
Expected: See calculators and assessment form
```

### **Test 5: Create Assessment**
```
1. Fill in PCOS assessment form
2. Click "Save Assessment"
Expected: Success message, data appears in list
```

### **Test 6: Backend Communication**
```
Open browser console (F12)
Look for:
✅ No CORS errors
✅ API calls to backend URL
✅ Successful responses (200 status)
```

---

## 🔒 **SECURITY NOTES**

### **Environment Variables:**
- ✅ `REACT_APP_API_URL` is safe to expose (it's a public URL)
- ❌ Never put `DATABASE_URL` in frontend
- ❌ Never put `JWT_SECRET` in frontend
- ✅ All sensitive data stays in backend only

### **What Gets Built:**
```
frontend/build/
├── index.html           ← Public HTML
├── static/
│   ├── css/            ← Minified CSS
│   └── js/             ← Minified JS (includes REACT_APP_API_URL)
└── ...

⚠️ Note: REACT_APP_API_URL will be visible in the JS bundle
This is NORMAL and SAFE - it's just a public URL
```

---

## 🆚 **STATIC SITE vs WEB SERVICE**

### **Static Site** (✅ RECOMMENDED for React):
- **Cost:** FREE tier available
- **Speed:** Very fast (CDN)
- **Use For:** React, Vue, Angular, HTML/CSS/JS
- **How:** Pre-built files served directly
- **Best For:** Frontend applications

### **Web Service** (❌ NOT NEEDED for React):
- **Cost:** $7/month minimum
- **Speed:** Slower (runs Node.js server)
- **Use For:** Backend APIs, Node.js servers
- **How:** Runs `npm start` continuously
- **Best For:** Backend with Express, databases, etc.

**For React Frontend: Use Static Site!** ✅

---

## 📱 **CUSTOM DOMAIN (OPTIONAL)**

After deployment, you can add a custom domain:

1. Go to your Static Site on Render
2. Click "Settings" tab
3. Scroll to "Custom Domains"
4. Click "Add Custom Domain"
5. Enter your domain (e.g., `pcos-app.com`)
6. Follow DNS configuration instructions
7. Render provides FREE SSL certificate!

---

## 🔄 **AUTO-DEPLOY ON GIT PUSH**

Render automatically redeploys when you push to GitHub!

```bash
# Make changes locally
git add .
git commit -m "Update frontend"
git push origin main

# Render automatically:
1. Detects push to main branch
2. Starts new build
3. Runs npm install && npm run build
4. Deploys new version
5. Your site updates! (2-3 minutes)
```

---

## 🎉 **SUMMARY**

### **Quick Steps:**
1. ✅ New Static Site on Render
2. ✅ Connect GitHub repo
3. ✅ Root Directory: `frontend`
4. ✅ Build: `npm install && npm run build`
5. ✅ Publish: `build`
6. ✅ Env: `REACT_APP_API_URL=[backend URL]`
7. ✅ Create Static Site
8. ✅ Wait 3-5 minutes
9. ✅ Test your app!

### **Your Full Stack App:**
```
Frontend (Static Site)
   ↓ API Calls
Backend (Web Service)
   ↓ Database Queries
Neon PostgreSQL
```

### **Final URLs:**
- **Frontend:** `https://pcos-homaiq-score-frontend.onrender.com`
- **Backend:** `https://pcos-homaiq-score-backend.onrender.com`
- **Database:** Neon PostgreSQL (connected to backend)

---

## 🚀 **YOU'RE READY TO DEPLOY!**

Follow the steps above, and your frontend will be live in 5 minutes! 🎉


# ⚡ QUICK DEPLOYMENT GUIDE

## 🎯 **Deploy in 10 Minutes**

### **Step 1: Get Your Neon Database URL**
1. Go to: https://console.neon.tech
2. Select project: `pcos_homaiq_score`
3. Copy connection string:
   ```
   postgresql://user:password@ep-xxxx.region.aws.neon.tech/pcos_homaiq_score?sslmode=require
   ```

---

### **Step 2: Deploy Backend to Render**

1. **Go to:** https://render.com/dashboard
2. **Click:** "New +" → "Web Service"
3. **Connect GitHub:** `muddusurendranehru/pcos_homaiq_score`
4. **Fill in:**
   ```
   Name: pcos-backend
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```
5. **Add Environment Variables:**
   ```
   DATABASE_URL = [paste your Neon URL]
   JWT_SECRET = [generate random 32+ character string]
   NODE_ENV = production
   PORT = 5000
   ```
6. **Click:** "Create Web Service"
7. **Wait 2-3 minutes** for deployment
8. **Copy URL:** `https://pcos-backend-xxxx.onrender.com`

---

### **Step 3: Deploy Frontend to Render**

1. **Click:** "New +" → "Static Site"
2. **Connect:** Same GitHub repository
3. **Fill in:**
   ```
   Name: pcos-frontend
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: build
   ```
4. **Add Environment Variable:**
   ```
   REACT_APP_API_URL = [paste your backend URL from Step 2]
   ```
5. **Click:** "Create Static Site"
6. **Wait 3-5 minutes** for build
7. **Copy URL:** `https://pcos-frontend.onrender.com`

---

### **Step 4: Update CORS in Backend**

1. Open your GitHub repository
2. Edit `backend/server.js`
3. Update CORS:
   ```javascript
   app.use(cors({
       origin: [
           'http://localhost:3038',
           'https://pcos-frontend.onrender.com'  // Add your frontend URL
       ],
       credentials: true
   }));
   ```
4. Commit and push
5. Render will auto-redeploy backend

---

### **Step 5: Test Your Live App**

1. Go to: `https://pcos-frontend.onrender.com`
2. Sign up with test account
3. Login
4. Fill PCOS assessment form
5. Save to database
6. Check Neon console to see saved data

---

## ✅ **That's It! Your App is Live!**

### **URLs:**
- Frontend: `https://pcos-frontend.onrender.com`
- Backend: `https://pcos-backend-xxxx.onrender.com`
- GitHub: `https://github.com/muddusurendranehru/pcos_homaiq_score`

---

## 🔧 **Generate JWT Secret**

Use one of these methods:

**Method 1: Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Method 2: Online**
Go to: https://www.uuidgenerator.net/
Click "Generate UUID" → Copy

**Method 3: Manual**
Type any random 32+ characters:
```
my_super_secret_jwt_key_12345678abcdefghijklmnop
```

---

## 🐛 **Troubleshooting**

### **Backend not starting:**
- Check Render logs
- Verify `DATABASE_URL` is correct
- Verify `JWT_SECRET` is set

### **Frontend can't connect:**
- Check `REACT_APP_API_URL` points to backend
- Update CORS in `backend/server.js`
- Check browser console for errors

### **Database connection fails:**
- Verify Neon database is active
- Check connection string format
- Ensure `?sslmode=require` is at the end

---

## 📞 **Need Help?**

Check the full guide: `DEPLOYMENT_GUIDE.md`


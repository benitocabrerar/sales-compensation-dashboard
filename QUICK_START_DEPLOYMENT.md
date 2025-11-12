# Quick Start: Deploy to Render in 10 Minutes

## Prerequisites Checklist
- [ ] GitHub account
- [ ] Render account (free)
- [ ] Git installed locally
- [ ] Node.js 18+ installed

---

## Step 1: Prepare Your Code (2 minutes)

### 1.1 Update Backend package.json
```bash
cd backend
# Replace package.json with package-updated.json
mv package-updated.json package.json
# Install PostgreSQL driver
npm install pg
```

### 1.2 Use the Render-ready server
```bash
# Rename server files
mv server.js server-original.js
mv server-render.js server.js
```

### 1.3 Create data directory placeholder
```bash
mkdir -p data
echo "{}" > data/.gitkeep
```

---

## Step 2: Initialize Git & GitHub (3 minutes)

### 2.1 Initialize Git
```bash
# Go to project root
cd C:\Users\benito\poweria\ventas

# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: Sales Compensation Dashboard ready for Render deployment"
```

### 2.2 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `sales-compensation-dashboard`
3. Set as Private or Public
4. Do NOT initialize with README
5. Click "Create repository"

### 2.3 Push to GitHub
```bash
# Add your repository (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/sales-compensation-dashboard.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy on Render (5 minutes)

### 3.1 Create PostgreSQL Database
1. Log in to https://dashboard.render.com
2. Click "New +" → "PostgreSQL"
3. Configure:
   - Name: `sales-dashboard-db`
   - Region: Oregon (US West)
   - Plan: Free
4. Click "Create Database"
5. Wait 2-3 minutes for creation
6. **COPY THE INTERNAL DATABASE URL** (you'll need it)

### 3.2 Deploy Backend
1. Click "New +" → "Web Service"
2. Connect GitHub repository
3. Configure:
   - Name: `sales-dashboard-api`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free
4. Click "Advanced" → Add Environment Variables:
   ```
   NODE_ENV = production
   DATABASE_URL = [paste Internal Database URL from step 3.1]
   FRONTEND_URL = https://sales-dashboard.onrender.com
   ```
5. Click "Create Web Service"

### 3.3 Deploy Frontend
1. Click "New +" → "Static Site"
2. Connect same GitHub repository
3. Configure:
   - Name: `sales-dashboard`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
4. Add Environment Variable:
   ```
   VITE_API_URL = https://sales-dashboard-api.onrender.com
   ```
5. Click "Create Static Site"

---

## Step 4: Verify Deployment

### 4.1 Check Service Status
- Backend: https://dashboard.render.com/web/sales-dashboard-api
- Frontend: https://dashboard.render.com/static/sales-dashboard
- Database: https://dashboard.render.com/postgres/sales-dashboard-db

### 4.2 Test Endpoints
```bash
# Test backend health (replace with your URL)
curl https://sales-dashboard-api.onrender.com/api/health

# Should return:
# {"status":"healthy","timestamp":"...","database":"connected"}
```

### 4.3 Access Your App
- Frontend: https://sales-dashboard.onrender.com
- Backend API: https://sales-dashboard-api.onrender.com/api/health

---

## Step 5: Run Database Migration (Optional)

If you have existing data to migrate:

```bash
cd backend

# Set your database URL (get from Render dashboard)
export DATABASE_URL="postgresql://..."

# Run migration
node migrate.js
```

---

## Common Issues & Solutions

### Issue 1: Backend won't start
**Solution:** Check logs at https://dashboard.render.com/web/sales-dashboard-api/logs
- Verify DATABASE_URL is set correctly
- Check for npm install errors

### Issue 2: Frontend shows connection error
**Solution:**
- Verify VITE_API_URL is set in frontend environment variables
- Check backend is running
- Wait 2-3 minutes for services to fully deploy

### Issue 3: Database connection fails
**Solution:**
- Copy Internal Database URL (not External)
- Make sure to include full connection string with credentials

### Issue 4: Services sleeping (free tier)
**Note:** Free tier services sleep after 15 minutes of inactivity. First request will take 30-60 seconds to wake up.

---

## Next Steps

### Make Changes
1. Edit your code locally
2. Commit changes: `git commit -am "Your change description"`
3. Push to GitHub: `git push`
4. Render auto-deploys within 2-3 minutes

### Monitor Your App
- View logs: Dashboard → Service → Logs
- Check metrics: Dashboard → Service → Metrics
- Database maintenance: Renew every 90 days (free tier)

### Upgrade When Needed
- Remove sleep delay: Upgrade to Starter ($7/month per service)
- Better database: Starter PostgreSQL ($7/month)
- Custom domain: Add in service settings (free with any plan)

---

## Emergency Rollback

If something goes wrong:

```bash
# Revert last commit
git revert HEAD --no-edit
git push

# Render will auto-deploy previous version
```

---

## Support Resources

- Render Documentation: https://render.com/docs
- Render Status: https://status.render.com
- Community Forum: https://community.render.com
- This project: Check DEPLOYMENT_PLAN.md for detailed information

---

## Deployment Checklist

Before deploying:
- [ ] Backend package.json updated with pg dependency
- [ ] server-render.js renamed to server.js
- [ ] .gitignore file present
- [ ] All changes committed to Git
- [ ] GitHub repository created and connected

During deployment:
- [ ] PostgreSQL database created
- [ ] Backend service created with environment variables
- [ ] Frontend static site created with API URL
- [ ] All services show "Live" status

After deployment:
- [ ] Health endpoint responds
- [ ] Frontend loads successfully
- [ ] Can create and save scenarios
- [ ] Data persists after refresh

---

## 🎉 Congratulations!

Your Sales Compensation Dashboard is now live on Render!

Remember:
- Free tier has limitations (sleep after 15 min, 90-day database renewal)
- Monitor your usage in the Render dashboard
- Commit and push to GitHub to deploy updates
- Keep your database URL secure

Happy selling! 🚀
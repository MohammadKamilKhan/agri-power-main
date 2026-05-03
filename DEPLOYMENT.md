# AgriPower Deployment Guide

This guide explains how to deploy the **AgriPower** project to free hosting platforms.

> Created by: **Sharook**

---

## Prerequisites

Before deploying, you need:
1. A **MongoDB Atlas** account (free tier available at [mongodb.com](https://www.mongodb.com))
2. A **GitHub** repository with your project code

### Setting Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a new cluster (M0 free tier is fine)
3. Create a database user with a strong password
4. Add your IP to the Network Access list (or use `0.0.0.0/0` for all IPs)
5. Get your connection string from **Database > Connect > Drivers > Node.js**
6. Your URI will look like:
   ```
   mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/agripower?retryWrites=true&w=majority
   ```

---

## Backend Deployment (Render - FREE)

1. **Create a Render account**: Go to [render.com](https://render.com) and sign up
2. **Create a New Web Service**:
   - Connect your GitHub repository
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
3. **Environment Variables** (add these in Render dashboard):
   - `MONGODB_URI`: Your MongoDB Atlas connection string (from step above)
   - `JWT_SECRET`: Any strong random string (e.g., `sharook_super_secret_key_2025`)
   - `NODE_ENV`: `production`
   - `PORT`: `5000` (Render will override this)
4. **Backend URL**: Once deployed, copy the backend URL (e.g., `https://agripower-backend.onrender.com`)

---

## Frontend Deployment (Vercel - FREE)

1. **Create a Vercel account**: Go to [vercel.com](https://vercel.com) and sign up
2. **Project Setup**:
   - Import your GitHub repository
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
3. **Environment Variables**:
   - `VITE_API_URL`: `https://your-backend-url.onrender.com/api` (Replace with your actual Render URL)
4. **Deploy**: Click Deploy

### Alternative: Netlify

1. Go to [netlify.com](https://app.netlify.com) and sign up
2. Click "Add new site" -> "Import an existing project"
3. Connect your GitHub repository
4. **Base Directory**: `frontend`
5. **Build Command**: `npm run build`
6. **Publish Directory**: `dist`
7. Add `VITE_API_URL` in Site Settings -> Environment Variables

---

## Post-Deployment: Seed the Database

After your backend is live, run the seed script to populate sample data:

```bash
# Local seeding (requires .env with MONGODB_URI pointing to Atlas)
cd backend
npm run seed
```

Or use Render Shell to run: `node utils/seed.js`

---

## Important Notes

- **Never commit your `.env` file** to GitHub (it's already in `.gitignore`)
- **Never share your MongoDB password** or JWT_SECRET
- The free tiers of Render and Vercel have some limitations but are perfect for demos

---

## Need Help?

If you face any issues:
1. Check Render/Vercel logs for errors
2. Verify your MongoDB Atlas connection string
3. Make sure CORS is configured properly (already handled in `server.js`)


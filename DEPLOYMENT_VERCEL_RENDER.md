# ScoutAI Deployment Guide — Vercel + Render

## Architecture

```
┌─────────────────────┐       ┌──────────────────────┐
│  Vercel (Frontend)  │       │  Render (Backend)    │
│  (HTML/CSS/JS)      │◄─────►│  (FastAPI + Python)  │
└─────────────────────┘       └──────────────────────┘
```

## Part 1: Deploy Backend to Render

### Step 1: Push to GitHub
```bash
cd /Users/divyanshdobhal/Desktop/PROJECTS/scoutai-master
git add .
git commit -m "Prepare for Vercel + Render deployment"
git push origin main
```

### Step 2: Create Render Service
1. Go to https://render.com and sign up/login
2. Click **"Create New"** → **"Web Service"**
3. Connect your GitHub repo: `DivyanshDobhal/scoutai-master`
4. Configure:
   - **Name**: `scoutai-backend`
   - **Environment**: Python 3.11
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
5. **Environment Variables**:
   - `GROQ_API_KEY`: [Paste your Groq API key](https://console.groq.com)
6. Click **Deploy**

### Step 3: Get Backend URL
After deployment, you'll get a URL like:
```
https://scoutai-backend.onrender.com
```

**Note**: Render's free tier spins down after 15 minutes of inactivity. For production, upgrade to paid tier.

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Project
1. Go to https://vercel.com and sign up/login
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repo: `DivyanshDobhal/scoutai-master`
4. Configure:
   - **Framework**: Other (vanilla HTML/CSS/JS)
   - **Build Command**: `npm run build`
   - **Output Directory**: `frontend`
   - **Install Command**: `npm install`

### Step 2: Set Environment Variables in Vercel
1. In Vercel project settings → **Environment Variables**
2. Add:
   - **Name**: `API_URL`
   - **Value**: `https://scoutai-backend.onrender.com` (your Render backend URL)
3. Click **Save**

### Step 3: How the API URL is injected
The repository already includes a Vercel build step:

```bash
npm run build
```

That command writes `frontend/config.js` from the `API_URL` environment variable. The browser reads that file before `frontend/app.js`, so no manual source-code edit is needed for each deployment.

### Step 4: Deploy
Click **Deploy** in Vercel. After ~1-2 minutes, your frontend will be live!

You'll get a URL like:
```
https://scoutai.vercel.app
```

---

## Part 3: Enable CORS on Backend

`backend/main.py` is already configured to allow:

- local development origins
- `https://*.vercel.app` preview and production URLs
- any custom frontend URLs listed in the backend environment variable `FRONTEND_URLS`

If you use a custom Vercel domain, add it to Render:

```text
FRONTEND_URLS=https://your-custom-domain.com
```

For multiple custom domains, separate them with commas.

---

## Part 4: Test Deployment

1. Open https://scoutai.vercel.app in your browser
2. Enter a job description
3. Click **Run Pipeline**
4. Verify results load (it may take 10-30s if Render is waking up)

---

## Troubleshooting

### Frontend can't reach backend?
- Check CORS is enabled in `backend/main.py`
- Verify `API` URL in `frontend/app.js` matches Render backend URL
- Use browser DevTools (Network tab) to see API call URLs and errors

### Render backend is slow?
- First request after inactivity takes 30-60s (free tier cold start)
- Upgrade to paid tier for persistent uptime

### GROQ_API_KEY not working?
- Verify key is set in Render environment variables
- Test locally: `python -c "import os; print(os.getenv('GROQ_API_KEY'))"`

---

## Local Development (Optional)

To test locally before pushing:

```bash
# Terminal 1: Backend
cd /Users/divyanshdobhal/Desktop/PROJECTS/scoutai-master
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export GROQ_API_KEY=your_key_here
uvicorn backend.main:app --reload --port 8000

# Terminal 2: Frontend (optional)
# Just open frontend/index.html or use a simple server:
python -m http.server 3000 --directory frontend
```

Then visit `http://localhost:3000`

---

## Cost Estimate

- **Vercel**: Free (frontend)
- **Render**: Free tier (backend) or $7/month for always-on
- **Groq API**: Free tier (5K requests/month) or pay-as-you-go

---

## Next Steps

1. Deploy backend to Render ✓
2. Deploy frontend to Vercel ✓
3. Test end-to-end ✓
4. Share link: https://scoutai.vercel.app
5. (Optional) Add custom domain
6. (Optional) Set up GitHub Actions for auto-deploy

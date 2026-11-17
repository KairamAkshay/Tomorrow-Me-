# Tomorrow Me — AI Decision Intelligence Platform

> **See Tomorrow. Decide Today.**  
> An AI-powered decision intelligence platform that simulates possible futures, reality-checks advice, and evaluates mental readiness before making life-altering choices.

---

## 🌟 Key Features

1. **Future Simulator**: Multi-agent Monte Carlo-style plausible timeline generation across 1, 2, 3, and 5-year horizons with score breakdowns, key opportunities, critical milestones, and major risk identification.
2. **Reality Check**: Critical analysis of advice, social media posts, or claims evaluating credibility, empirical backing, cognitive bias, and hidden assumptions.
3. **Mind Mirror**: Holistic lifestyle and wellness assessment evaluating focus levels, burnout risk, attention health, and cognitive decision readiness.
4. **Judge Agent**: Synthesizes and cross-references results across all analytical vectors into actionable recommendations with clear reasoning and prioritized next steps.
5. **MongoDB Atlas Integration**: Isolated persistent storage for users, decision simulations, reality reports, mind mirror profiles, and expiring password reset tokens.

---

## 🛠️ Architecture

- **Backend**: FastAPI (Python 3.12), Motor / PyMongo (Async MongoDB Driver), JWT Authentication (Bcrypt + python-jose), Gemini 2.0 Flash / OpenAI API.
- **Frontend**: Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4, Lucide Icons, Framer Motion, Recharts.
- **Database**: MongoDB Atlas (`tomorrow_me_ai`).
- **Deployments**: Vercel (Frontend), Render (Backend).

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Node.js** >= 20.x
- **Python** >= 3.12.x
- **MongoDB** (Local instance or MongoDB Atlas cluster connection string)

---

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\Activate.ps1
# Mac/Linux:
source venv/bin/activate

# Install dependencies
python -m pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and supply your MONGODB_URI and GEMINI_API_KEY / AI_API_KEY
```

#### Run the Backend Server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- API Docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/api/health`

#### Run Backend Integration Tests:
```bash
python -m pytest test_api.py -v
```

---

### 3. Frontend Setup

```bash
cd frontend

# Install packages
npm install

# Configure environment variables
cp .env.example .env.local
# Default NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Run development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority` |
| `DATABASE_NAME` | Database name | `tomorrow_me_ai` |
| `JWT_SECRET` | Secret key for JWT signing | `random-secure-secret-string` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT expiration | `60` |
| `RESET_TOKEN_EXPIRE_MINUTES` | Password reset link expiration | `30` |
| `FRONTEND_URL` | Frontend client origin | `http://localhost:3000` |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:3000,http://127.0.0.1:3000` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIzaSy...` |
| `AI_BASE_URL` | AI Gateway endpoint | `https://generativelanguage.googleapis.com/v1beta/openai/` |
| `AI_MODEL` | Target AI model | `gemini-2.0-flash` |

### Frontend (`frontend/.env.local`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000/api` |

---

## 🗄️ MongoDB Database Collections & Indexes

Database Name: `tomorrow_me_ai`

1. **`users`**
   - Indexes: `{ email: 1 }` (unique)
   - Documents: `_id`, `email`, `full_name`, `hashed_password`, `created_at`, `updated_at`.

2. **`simulations`**
   - Indexes: `{ user_id: 1 }`, `{ created_at: 1 }`
   - Documents: `_id`, `user_id`, `situation`, `goal`, `choices`, `timelines`, `recommendation`, `created_at`, `updated_at`.

3. **`decision_reports`** (Reality Checks)
   - Indexes: `{ user_id: 1 }`, `{ created_at: 1 }`
   - Documents: `_id`, `user_id`, `content`, `content_type`, `analysis`, `overall_score`, `created_at`, `updated_at`.

4. **`mind_mirror_results`**
   - Indexes: `{ user_id: 1 }`, `{ created_at: 1 }`
   - Documents: `_id`, `user_id`, `sleep`, `screen_time`, `study_hours`, `exercise`, `stress`, `mood`, `analysis`, `focus_score`, `burnout_risk`, `decision_readiness`, `attention_health`, `created_at`, `updated_at`.

5. **`password_reset_tokens`**
   - Indexes: `{ token: 1 }` (unique), `{ expires_at: 1 }` (TTL expiration)
   - Documents: `_id`, `user_id`, `token`, `expires_at`, `used`, `created_at`.

---

## 🚢 Deployment Instructions

### 1. Backend on Render
1. Create a **New Web Service** connected to your repository.
2. Root Directory: `backend`
3. Environment: `Python 3`
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Set Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas URI
   - `DATABASE_NAME`: `tomorrow_me_ai`
   - `JWT_SECRET`: A high-entropy random string
   - `GEMINI_API_KEY`: Your Gemini API key
   - `FRONTEND_URL`: `https://tomorrow-me-red.vercel.app`
   - `CORS_ORIGINS`: `https://tomorrow-me-red.vercel.app`

### 2. Frontend on Vercel
1. Import repository on Vercel with Root Directory set to `frontend`.
2. Framework Preset: **Next.js**.
3. Build Command: `npm run build`.
4. Environment Variables:
   - `NEXT_PUBLIC_API_URL`: `https://tomorrow-me-backend.onrender.com/api` (or your Render backend URL)
   - `BACKEND_URL`: `https://tomorrow-me-backend.onrender.com`

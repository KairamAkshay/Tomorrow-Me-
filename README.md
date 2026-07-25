# Tomorrow Me — AI Decision Intelligence Platform

> **"See Tomorrow. Decide Today."**

An AI-powered Decision Intelligence Platform built for Gen Z, college students, fresh graduates, and early-career professionals standing at life’s biggest crossroads.

---

## 📖 The Story: The Decision Crisis

Meet **Alex**, a final-year Computer Science student in 2025.

Alex is 22, exhausted from midterms, and staring at three radically different paths:
1. **Option A**: Take a high-risk, un-paid internship at an AI startup in Bangalore.
2. **Option B**: Accept a safe, structured corporate job offer from a legacy tech firm.
3. **Option C**: Prepare for GRE/GATE and pursue higher studies abroad.

Every night, Alex scrolls LinkedIn and X (Twitter). Every post claims to have the answer:
> *"Quit your 9-to-5! If you don't build your startup by 23, you failed!"*
> *"Higher studies are a waste of money — just grind LeetCode!"*
> *"Join a Fortune 500 company for work-life balance!"*

The advice is conflicting, noisy, and dripping with survivorship bias. Worse, Alex is making this decision on 5 hours of sleep, 8 hours of screen time, and peak burnout.

### Enter **Tomorrow Me**.

Instead of predicting the future like a horoscope, **Tomorrow Me** is a high-precision simulation engine. It allows Alex to test-drive possible futures before making a single real-world commitment. It checks the credibility of noisy advice, evaluates Alex's mental readiness, and synthesizes 5-year multidimensional projections using a multi-agent AI system.

---

## 🔄 Detailed Platform Workflow

```mermaid
flowchart TD
    A[Landing Page: "Meet Tomorrow You"] --> B[Local JWT Auth & Security]
    B --> C[Dashboard Command Center]
    
    C --> D[Tool 1: Future Simulator]
    C --> E[Tool 2: Reality Check]
    C --> F[Tool 3: Mind Mirror]
    
    D --> D1[Future Agent: Simulate 5-Yr Timelines A, B, C]
    E --> E1[Reality Agent: Evaluate Credibility & Bias]
    F --> F1[Psychology Agent: Compute Focus & Burnout Risk]
    
    D1 --> G[Judge Agent: Synthesize Verdict]
    E1 --> G
    F1 --> G
    
    G --> H[Unified Decision Report & PDF Export]
```

### 1. Landing & Onboarding
- **The Experience**: Alex lands on a dark, glassmorphic interface inspired by Linear, Apple, and Vercel. Floating canvas particles drift in the background while glowing gradients highlight the core mission: *"Every decision creates a different future."*
- **Auth**: Alex registers an account. Password security is handled via direct `bcrypt` hashing and authentication issues stateless `JWT` bearer tokens.

### 2. Feature One: Future Simulator (`/simulator`)
- **Input**: Alex inputs current situation, core life goal, and up to 5 potential choices.
- **AI Processing**: The `FutureAgent` fires parallel simulations for each choice across a 5-year timeline.
- **The Output**:
  - **Year 1, 2, 3, & 5 Trajectories**: Specific narrative evolution per choice.
  - **8 Dimensional Metrics**: Career Growth, Income Potential, Skill Development, Network Growth, Mental Wellbeing, Risk Level, Opportunities, Confidence.
  - **Visual Analytics**: Interactive Recharts Radar Chart and multi-bar comparison graph.
  - **Milestone Roadmap & Risk Audit**: Key warnings (e.g. initial cash crunch) and critical achievements.

### 3. Feature Two: Reality Check (`/reality-check`)
- **Input**: Alex pastes that viral LinkedIn post claiming *"Quit your job and do dropshipping"*.
- **AI Processing**: The `RealityAgent` dissects the text line by line.
- **The Output**:
  - **Reality Score (0–100)**: Animated circular gauge rating overall trustworthiness.
  - **Bias & Evidence Audit**: Identifies survivorship bias, hidden resource assumptions, and emotional language.
  - **Red Flags vs. Strengths**: Highlighted lists exposing what the post left out.

### 4. Feature Three: Mind Mirror (`/mind-mirror`)
- **Input**: Alex adjusts interactive sliders for daily sleep (hours), screen time, study/work load, exercise, stress level (1-10), and mood (1-10).
- **AI Processing**: The `PsychologyAgent` evaluates cognitive load and decision readiness using evidence-based wellness models.
- **The Output**:
  - **4 Score Gauges**: Focus Score, Burnout Risk, Decision Readiness, and Attention Health.
  - **Prioritized Recommendations**: Color-coded action steps (e.g., *"Delay big decisions until sleep debt is recovered"*).

### 5. The Judge Agent & Unified Reports (`/reports`)
- **Synthesis**: The `JudgeAgent` combines the outputs of all agents to give Alex a clear, decisive verdict, confidence level, and step-by-step action plan.
- **Reports Hub**: Alex can review, filter, and track all past simulations and reality checks over time in a unified history view.

---

## 🤖 AI Multi-Agent Architecture

The platform relies on a 4-Agent collaborative intelligence model:

| Agent Name | Specialty | Role & Responsibility |
|------------|-----------|------------------------|
| **Future Agent** | Multiverse Projection | Simulates 5-year trajectories per decision branch with 8 quantitative scores |
| **Reality Agent** | Fact & Bias Detection | Evaluates external claims for evidence quality, bias level, and practicality |
| **Psychology Agent** | Cognitive Health | Analyzes lifestyle inputs to determine burnout risk and decision capacity |
| **Judge Agent** | Decision Synthesis | Combines all outputs into a final verdict, confidence rating, and next steps |

---

## 💻 Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Framer Motion, Recharts, Lucide Icons, Shadcn UI |
| **Backend** | FastAPI, Python 3.12, Pydantic v2, Uvicorn, SQLAlchemy |
| **Database** | SQLite |
| **Authentication** | Direct `bcrypt` password hashing + JWT Bearer Tokens |
| **AI System** | Multi-Agent LLM architecture (OpenAI / Groq compatible with automated fallback generators) |

---

## ⚡ Quick Start & Installation

### Prerequisites
- Node.js 18+
- Python 3.12+

### 1. Backend Setup
```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload --port 8000
```
Backend will run at: `http://localhost:8000`  
API Docs (Swagger): `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will run at: `http://localhost:3000`

---

## 🧪 Testing

To run the end-to-end integration test suite covering database operations, authentication, AI fallbacks, and all 6 core API routes:

```bash
cd backend
.\venv\Scripts\python.exe test_api.py
```

To test the frontend production build and TypeScript check:
```bash
cd frontend
npm run build
```

---

## 📜 License

MIT License. Built for the National AI Hackathon 2025.

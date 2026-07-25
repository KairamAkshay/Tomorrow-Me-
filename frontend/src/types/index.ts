/** TypeScript type definitions for the Tomorrow Me application. */

/* ===== Auth Types ===== */
export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

/* ===== Simulator Types ===== */
export interface SimulationRequest {
  situation: string;
  goal: string;
  choices: string[];
}

export interface TimelineScores {
  career_growth: number;
  income_potential: number;
  skill_development: number;
  network_growth: number;
  mental_wellbeing: number;
  risk_level: number;
  opportunities: number;
  confidence: number;
}

export interface Timeline {
  choice: string;
  timeline_summary: string;
  year_1: string;
  year_2: string;
  year_3: string;
  year_5: string;
  scores: TimelineScores;
  key_risks: string[];
  key_opportunities: string[];
  critical_milestones: string[];
}

export interface JudgeResult {
  verdict: string;
  confidence: number;
  reasoning: string;
  recommendation: string;
  next_steps: string[];
  caveats: string[];
}

export interface Simulation {
  id: number;
  situation: string;
  goal: string;
  choices: string[];
  timelines: Timeline[];
  recommendation: JudgeResult | null;
  created_at: string;
}

/* ===== Reality Check Types ===== */
export type ContentType =
  | "advice"
  | "tweet"
  | "linkedin_post"
  | "instagram_caption"
  | "article"
  | "other";

export interface RealityCheckRequest {
  content: string;
  content_type: ContentType;
}

export interface RealityScores {
  credibility: number;
  evidence_quality: number;
  bias_level: number;
  hidden_assumptions: number;
  practicality: number;
  risk_level: number;
  suitability_for_gen_z: number;
}

export interface RealityAnalysis {
  overall_score: number;
  summary: string;
  scores: RealityScores;
  explanations: Record<string, string>;
  red_flags: string[];
  strengths: string[];
  recommendation: string;
}

export interface RealityCheck {
  id: number;
  content: string;
  content_type: string;
  analysis: RealityAnalysis;
  overall_score: number;
  created_at: string;
}

/* ===== Mind Mirror Types ===== */
export interface MindAssessmentRequest {
  sleep: number;
  screen_time: number;
  study_hours: number;
  exercise: number;
  stress: number;
  mood: number;
}

export interface MindRecommendation {
  area: string;
  suggestion: string;
  priority: "high" | "medium" | "low";
}

export interface MindAnalysis {
  focus_score: number;
  burnout_risk: number;
  decision_readiness: number;
  attention_health: number;
  overall_wellness: number;
  analysis: Record<string, string>;
  recommendations: MindRecommendation[];
  positive_habits: string[];
  warning_signs: string[];
}

export interface MindAssessment {
  id: number;
  sleep: number;
  screen_time: number;
  study_hours: number;
  exercise: number;
  stress: number;
  mood: number;
  analysis: MindAnalysis;
  focus_score: number;
  burnout_risk: number;
  decision_readiness: number;
  attention_health: number;
  created_at: string;
}

/* ===== Reports Types ===== */
export interface ReportItem {
  id: number;
  type: "simulation" | "reality_check" | "mind_assessment";
  title: string;
  summary: string;
  score: number | null;
  data: Record<string, unknown>;
  created_at: string;
}

export interface ReportsListResponse {
  reports: ReportItem[];
  total: number;
}

/* ===== API Health ===== */
export interface HealthResponse {
  status: string;
  app: string;
  version: string;
  ai_available: boolean;
}

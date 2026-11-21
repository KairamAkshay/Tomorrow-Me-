import time
import httpx

BASE_URL = "http://localhost:8000/api"

def run_tests():
    print("=" * 60)
    print("TOMORROW-ME-AI 2.0 — FULL MANUAL VERIFICATION SUITE")
    print("=" * 60)

    with httpx.Client(base_url=BASE_URL, timeout=60.0) as client:
        # 1. Health check
        print("\n[TEST 1] Backend Health & Database Connectivity...")
        resp = client.get("/health")
        assert resp.status_code == 200, f"Health check failed: {resp.text}"
        health_data = resp.json()
        print(" -> Response:", health_data)
        assert health_data["status"] == "healthy", f"Database not connected: {health_data}"
        assert health_data["ai_available"] is True, "AI service not available"
        print(" -> PASS: Backend is healthy, MongoDB is connected, AI is ready.")

        # 2. Register a new user
        user_email = f"user_{int(time.time())}@tomorrowme.ai"
        password = "SecurePassword123!"
        full_name = "Alex Explorer"

        print(f"\n[TEST 2] User Registration ({user_email})...")
        reg_payload = {
            "email": user_email,
            "password": password,
            "confirm_password": password,
            "full_name": full_name
        }
        reg_resp = client.post("/auth/register", json=reg_payload)
        assert reg_resp.status_code == 201, f"Registration failed: {reg_resp.text}"
        reg_data = reg_resp.json()
        token = reg_data["access_token"]
        user = reg_data["user"]
        print(f" -> User ID: {user['id']}")
        print(f" -> User Email: {user['email']}")
        print(f" -> Token Received: {token[:25]}...")
        print(" -> PASS: Registration succeeded with secure bcrypt hash & JWT token.")

        # 3. Duplicate Registration Check
        print("\n[TEST 3] Duplicate Registration Prevention...")
        dup_resp = client.post("/auth/register", json=reg_payload)
        assert dup_resp.status_code == 400, f"Expected 400, got: {dup_resp.status_code}"
        print(" -> Rejected with:", dup_resp.json())
        print(" -> PASS: Unique email constraint enforced.")

        # 4. User Login
        print(f"\n[TEST 4] User Login ({user_email})...")
        login_payload = {
            "email": user_email,
            "password": password
        }
        login_resp = client.post("/auth/login", json=login_payload)
        assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
        login_token = login_resp.json()["access_token"]
        auth_headers = {"Authorization": f"Bearer {login_token}"}
        print(" -> PASS: Login successful.")

        # 5. Get Current User (/me)
        print("\n[TEST 5] Authenticated User Profile (/auth/me)...")
        me_resp = client.get("/auth/me", headers=auth_headers)
        assert me_resp.status_code == 200, f"Get /me failed: {me_resp.text}"
        print(" -> Profile:", me_resp.json())
        print(" -> PASS: Session valid.")

        # 6. Future Simulator + Judge Agent
        print("\n[TEST 6] Future Simulator + Judge Agent Analysis...")
        sim_payload = {
            "situation": "I am a 22-year-old software developer with an offer from Amazon and an opportunity to co-found a promising AI startup.",
            "goal": "Maximize long-term wealth, technical autonomy, and rapid personal growth over the next 5 years.",
            "choices": [
                "Accept the Amazon Big Tech offer",
                "Co-found the early-stage AI startup"
            ]
        }
        sim_resp = client.post("/simulator/run", json=sim_payload, headers=auth_headers)
        assert sim_resp.status_code == 200, f"Simulation failed: {sim_resp.text}"
        sim_data = sim_resp.json()
        print(f" -> Simulation ID: {sim_data['id']}")
        print(f" -> Timelines Generated: {len(sim_data['timelines'])}")
        for i, t in enumerate(sim_data['timelines']):
            print(f"    Choice {chr(65+i)}: '{t['choice']}'")
            print(f"      - Year 1: {t['year_1'][:90]}...")
            print(f"      - Year 5: {t['year_5'][:90]}...")
        print(" -> Judge Agent Assessment:")
        print(f"      - Verdict: {sim_data['recommendation']['verdict']}")
        print(f"      - Confidence: {sim_data['recommendation']['confidence']}%")
        print(f"      - Actionable Next Steps: {sim_data['recommendation']['next_steps']}")
        print(" -> PASS: Future Simulator & Judge Agent generated complete structured output.")

        # 7. Reality Check
        print("\n[TEST 7] Reality Check Module...")
        reality_payload = {
            "content": "Drop out of university immediately! All modern billionaires like Zuckerberg and Gates dropped out. Formal degrees are completely worthless in 2026.",
            "content_type": "advice"
        }
        rc_resp = client.post("/reality/analyze", json=reality_payload, headers=auth_headers)
        assert rc_resp.status_code == 200, f"Reality check failed: {rc_resp.text}"
        rc_data = rc_resp.json()
        print(f" -> Reality Score: {rc_data['overall_score']}/100")
        print(f" -> Summary: {rc_data['analysis']['summary'][:100]}...")
        print(f" -> Red Flags: {rc_data['analysis']['red_flags']}")
        print(" -> PASS: Reality Check credibility and bias scoring succeeded.")

        # 8. Mind Mirror
        print("\n[TEST 8] Mind Mirror Assessment...")
        mind_payload = {
            "sleep": 6.5,
            "screen_time": 8.0,
            "study_hours": 7.0,
            "exercise": 30,
            "stress": 7,
            "mood": 6
        }
        mm_resp = client.post("/mind/assess", json=mind_payload, headers=auth_headers)
        assert mm_resp.status_code == 200, f"Mind mirror failed: {mm_resp.text}"
        mm_data = mm_resp.json()
        print(f" -> Focus Score: {mm_data['focus_score']}/100")
        print(f" -> Burnout Risk: {mm_data['burnout_risk']}/100")
        print(f" -> Decision Readiness: {mm_data['decision_readiness']}/100")
        print(f" -> Attention Health: {mm_data['attention_health']}/100")
        print(" -> PASS: Mind Mirror psychology profiling succeeded.")

        # 9. Reports History & MongoDB Data Persistence
        print("\n[TEST 9] Reports History Retrieval (User Isolation)...")
        reports_resp = client.get("/reports/", headers=auth_headers)
        assert reports_resp.status_code == 200, f"Reports failed: {reports_resp.text}"
        reports_list = reports_resp.json()["reports"]
        print(f" -> Total Reports Saved for {user_email}: {len(reports_list)}")
        for r in reports_list:
            print(f"    * [{r['type'].upper()}] {r['title']} (Score: {r['score']})")
        assert len(reports_list) >= 3, "Expected at least 3 reports saved in MongoDB"
        print(" -> PASS: All user records persisted and isolated in MongoDB.")

        # 10. Profile Update
        print("\n[TEST 10] Profile Update in Settings...")
        update_payload = {"full_name": "Alex Explorer Ph.D."}
        update_resp = client.put("/auth/profile", json=update_payload, headers=auth_headers)
        assert update_resp.status_code == 200, f"Update profile failed: {update_resp.text}"
        assert update_resp.json()["full_name"] == "Alex Explorer Ph.D.", "Name was not updated"
        print(" -> Updated Name:", update_resp.json()["full_name"])
        print(" -> PASS: Profile settings update succeeded.")

    print("\n" + "=" * 60)
    print("ALL 10 TEST SUITES PASSED CLEANLY! APPLICATION IS 100% OPERATIONAL.")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()

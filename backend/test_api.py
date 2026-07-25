"""End-to-end integration test suite for Tomorrow Me backend."""

import sys
from fastapi.testclient import TestClient
from app.main import app
from app.database import create_tables

import time

def run_tests():
    print("Initializing test database tables...")
    create_tables()

    client = TestClient(app)
    ts = int(time.time())

    print("\n--- Testing Health Endpoint ---")
    res = client.get("/api/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    print("[PASS] Health Check Passed:", res.json())

    print("\n--- Testing Auth Module ---")
    # Register
    reg_data = {
        "username": f"testuser_{ts}",
        "email": f"test_{ts}@example.com",
        "password": "password123",
        "full_name": "Test User",
    }
    res = client.post("/api/auth/register", json=reg_data)
    assert res.status_code == 201, f"Registration failed: {res.text}"
    token_resp = res.json()
    token = token_resp["access_token"]
    print("[PASS] Registration Passed:", token_resp["user"]["username"])

    headers = {"Authorization": f"Bearer {token}"}

    # Me
    res = client.get("/api/auth/me", headers=headers)
    assert res.status_code == 200, f"Get me failed: {res.text}"
    print("[PASS] Get Current User Passed:", res.json()["email"])

    # Login
    login_data = {"username": f"testuser_{ts}", "password": "password123"}
    res = client.post("/api/auth/login", json=login_data)
    assert res.status_code == 200, f"Login failed: {res.text}"
    print("[PASS] Login Passed")

    print("\n--- Testing Future Simulator Module ---")
    sim_data = {
        "situation": "I am a final year CS student deciding between a startup offer and higher studies.",
        "goal": "Build long-term technical expertise and financial independence.",
        "choices": ["Join Startup", "Higher Studies"],
    }
    res = client.post("/api/simulator/run", json=sim_data, headers=headers)
    assert res.status_code == 201, f"Simulation failed: {res.text}"
    sim_resp = res.json()
    assert len(sim_resp["timelines"]) == 2
    assert sim_resp["recommendation"] is not None
    print("[PASS] Future Simulator Passed:", len(sim_resp["timelines"]), "timelines simulated")

    # List simulations
    res = client.get("/api/simulator/", headers=headers)
    assert res.status_code == 200 and len(res.json()) >= 1
    print("[PASS] List Simulations Passed")

    print("\n--- Testing Reality Check Module ---")
    reality_data = {
        "content": "Just quit your 9 to 5 job and start dropshipping. Anyone can make 10k a month with zero experience.",
        "content_type": "advice",
    }
    res = client.post("/api/reality/analyze", json=reality_data, headers=headers)
    assert res.status_code == 201, f"Reality Check failed: {res.text}"
    reality_resp = res.json()
    assert "overall_score" in reality_resp
    print("[PASS] Reality Check Passed: Score =", reality_resp["overall_score"])

    # List reality checks
    res = client.get("/api/reality/", headers=headers)
    assert res.status_code == 200 and len(res.json()) >= 1
    print("[PASS] List Reality Checks Passed")

    print("\n--- Testing Mind Mirror Module ---")
    mind_data = {
        "sleep": 7.5,
        "screen_time": 5.0,
        "study_hours": 6.0,
        "exercise": 45,
        "stress": 4,
        "mood": 8,
    }
    res = client.post("/api/mind/assess", json=mind_data, headers=headers)
    assert res.status_code == 201, f"Mind Mirror failed: {res.text}"
    mind_resp = res.json()
    assert mind_resp["focus_score"] > 0
    print("[PASS] Mind Mirror Passed: Focus Score =", mind_resp["focus_score"])

    # List mind assessments
    res = client.get("/api/mind/", headers=headers)
    assert res.status_code == 200 and len(res.json()) >= 1
    print("[PASS] List Mind Assessments Passed")

    print("\n--- Testing Reports Module ---")
    res = client.get("/api/reports/", headers=headers)
    assert res.status_code == 200
    reports_resp = res.json()
    assert reports_resp["total"] >= 3
    print("[PASS] Unified Reports Passed: Total Reports =", reports_resp["total"])

    print("\nALL BACKEND ENDPOINTS ARE WORKING PERFECTLY!\n")

if __name__ == "__main__":
    run_tests()

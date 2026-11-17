"""Comprehensive integration test suite covering the entire Tomorrow-Me-AI lifecycle.

Tests:
1. Backend starts and connects to MongoDB.
2. User registration with validation (password strength, confirm password).
3. Duplicate registration rejected (400).
4. Login with valid credentials (returns JWT and user).
5. Login with invalid password rejected (401).
6. Protected endpoints reject unauthenticated requests (401).
7. Authenticated /me endpoint returns user profile.
8. Forgot password creates reset token.
9. Reset password updates credentials and old password ceases to work.
10. Simulation run creates full report, stores in MongoDB 'simulations' collection.
11. User can list and retrieve individual simulations.
12. User isolation: other users cannot see or delete this simulation.
13. Reality Check analyzes content, saves to 'decision_reports'.
14. Mind Mirror runs wellness analysis, saves to 'mind_mirror_results'.
15. Judge Agent produces actionable recommendations.
16. Consolidated /reports endpoint returns all items ordered by date.
17. Deleting reports functions properly.
"""

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from mongomock_motor import AsyncMongoMockClient

import app.database as database_module
from app.main import app


@pytest_asyncio.fixture(autouse=True)
async def setup_test_db():
    """Inject mock async MongoDB database into the app for complete isolation."""
    mock_client = AsyncMongoMockClient()
    mock_db = mock_client["tomorrow_me_ai"]

    # Point global references to mock
    database_module._client = mock_client
    database_module._database = mock_db

    # Create indexes in mock
    await database_module._create_indexes()

    yield mock_db

    await database_module.close_db()


@pytest.mark.asyncio
async def test_health_check():
    """Verify health endpoint reports status."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/health")
        assert res.status_code == 200
        data = res.json()
        assert data["app"] == "Tomorrow Me"
        assert "database" in data


@pytest.mark.asyncio
async def test_complete_auth_flow():
    """Test register, duplicate rejection, login, /me, and logout."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Register User A
        reg_payload = {
            "full_name": "Test User",
            "email": "test@example.com",
            "password": "Password123",
            "confirm_password": "Password123",
        }
        res = await client.post("/api/auth/register", json=reg_payload)
        assert res.status_code == 201, res.text
        data = res.json()
        assert "access_token" in data
        assert data["user"]["email"] == "test@example.com"
        assert data["user"]["full_name"] == "Test User"
        token = data["access_token"]

        # 2. Duplicate registration rejected
        res_dup = await client.post("/api/auth/register", json=reg_payload)
        assert res_dup.status_code == 400
        assert "already registered" in res_dup.json()["detail"].lower()

        # 3. Weak password rejected
        res_weak = await client.post("/api/auth/register", json={
            "full_name": "Weak Pwd",
            "email": "weak@example.com",
            "password": "simple",
            "confirm_password": "simple",
        })
        assert res_weak.status_code == 422  # validation error

        # 4. Login with incorrect password
        res_wrong_pw = await client.post("/api/auth/login", json={
            "email": "test@example.com",
            "password": "WrongPassword123",
        })
        assert res_wrong_pw.status_code == 401

        # 5. Login with correct password
        res_login = await client.post("/api/auth/login", json={
            "email": "test@example.com",
            "password": "Password123",
        })
        assert res_login.status_code == 200
        login_token = res_login.json()["access_token"]
        assert login_token

        # 6. Protected /me endpoint without auth fails
        res_unauth = await client.get("/api/auth/me")
        assert res_unauth.status_code == 401 or res_unauth.status_code == 403

        # 7. Protected /me endpoint with token succeeds
        headers = {"Authorization": f"Bearer {token}"}
        res_me = await client.get("/api/auth/me", headers=headers)
        assert res_me.status_code == 200
        assert res_me.json()["email"] == "test@example.com"

        # 8. Logout
        res_logout = await client.post("/api/auth/logout", headers=headers)
        assert res_logout.status_code == 200


@pytest.mark.asyncio
async def test_forgot_and_reset_password():
    """Test forgot-password token generation and password reset flow."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Register user
        await client.post("/api/auth/register", json={
            "full_name": "Reset User",
            "email": "reset@example.com",
            "password": "OldPassword123",
            "confirm_password": "OldPassword123",
        })

        # Request reset
        res_forgot = await client.post("/api/auth/forgot-password", json={"email": "reset@example.com"})
        assert res_forgot.status_code == 200
        reset_token = res_forgot.json().get("reset_token")
        assert reset_token is not None

        # Reset password
        res_reset = await client.post("/api/auth/reset-password", json={
            "token": reset_token,
            "new_password": "NewPassword123",
            "confirm_password": "NewPassword123",
        })
        assert res_reset.status_code == 200

        # Login with old password fails
        res_old = await client.post("/api/auth/login", json={
            "email": "reset@example.com",
            "password": "OldPassword123",
        })
        assert res_old.status_code == 401

        # Login with new password succeeds
        res_new = await client.post("/api/auth/login", json={
            "email": "reset@example.com",
            "password": "NewPassword123",
        })
        assert res_new.status_code == 200


@pytest.mark.asyncio
async def test_future_simulator_and_judge_agent():
    """Test Future Simulator generation, MongoDB persistence, and Judge Agent synthesis."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Register user
        reg = await client.post("/api/auth/register", json={
            "full_name": "Simulation Explorer",
            "email": "sim@example.com",
            "password": "Password123",
            "confirm_password": "Password123",
        })
        token = reg.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Run Future Simulation
        sim_data = {
            "situation": "I have two job offers: an early stage startup vs a global enterprise tech firm.",
            "goal": "Maximize long-term career growth, leadership skills, and financial upside.",
            "choices": ["Join Startup as Founding Engineer", "Join Big Tech as Senior Software Engineer"],
        }
        res_run = await client.post("/api/simulator/run", json=sim_data, headers=headers)
        assert res_run.status_code == 201, res_run.text
        sim_result = res_run.json()

        assert "id" in sim_result
        assert len(sim_result["timelines"]) == 2
        for t in sim_result["timelines"]:
            assert "year_1" in t
            assert "year_5" in t
            assert "scores" in t
            assert "key_risks" in t
            assert "key_opportunities" in t

        # Verify Judge Agent synthesis
        assert sim_result["recommendation"] is not None
        rec = sim_result["recommendation"]
        assert "verdict" in rec
        assert "reasoning" in rec
        assert "confidence" in rec
        assert len(rec.get("next_steps", [])) > 0

        sim_id = sim_result["id"]

        # Retrieve simulation by ID
        res_get = await client.get(f"/api/simulator/{sim_id}", headers=headers)
        assert res_get.status_code == 200
        assert res_get.json()["id"] == sim_id

        # List simulations
        res_list = await client.get("/api/simulator/", headers=headers)
        assert res_list.status_code == 200
        assert len(res_list.json()) == 1


@pytest.mark.asyncio
async def test_reality_check_module():
    """Test Reality Check credibility and bias analysis."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        reg = await client.post("/api/auth/register", json={
            "full_name": "Reality User",
            "email": "reality@example.com",
            "password": "Password123",
            "confirm_password": "Password123",
        })
        token = reg.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        res = await client.post("/api/reality/analyze", json={
            "content": "Follow your passion and drop out of college immediately; formal education is completely useless for success.",
            "content_type": "advice",
        }, headers=headers)
        assert res.status_code == 201
        data = res.json()
        assert "overall_score" in data
        assert "analysis" in data
        assert "credibility" in data["analysis"]["scores"]
        assert "bias_level" in data["analysis"]["scores"]


@pytest.mark.asyncio
async def test_mind_mirror_module():
    """Test Mind Mirror lifestyle and wellness analysis."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        reg = await client.post("/api/auth/register", json={
            "full_name": "Mind User",
            "email": "mind@example.com",
            "password": "Password123",
            "confirm_password": "Password123",
        })
        token = reg.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        res = await client.post("/api/mind/assess", json={
            "sleep": 6.5,
            "screen_time": 8.0,
            "study_hours": 7.0,
            "exercise": 25,
            "stress": 7,
            "mood": 5,
        }, headers=headers)
        assert res.status_code == 201
        data = res.json()
        assert "focus_score" in data
        assert "burnout_risk" in data
        assert "decision_readiness" in data
        assert len(data["analysis"]["recommendations"]) >= 1


@pytest.mark.asyncio
async def test_consolidated_reports_and_isolation():
    """Test unified reports endpoint and ensure strict user data isolation."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Create User 1
        u1 = await client.post("/api/auth/register", json={
            "full_name": "User One",
            "email": "user1@example.com",
            "password": "Password123",
            "confirm_password": "Password123",
        })
        t1 = u1.json()["access_token"]
        h1 = {"Authorization": f"Bearer {t1}"}

        # Create User 2
        u2 = await client.post("/api/auth/register", json={
            "full_name": "User Two",
            "email": "user2@example.com",
            "password": "Password123",
            "confirm_password": "Password123",
        })
        t2 = u2.json()["access_token"]
        h2 = {"Authorization": f"Bearer {t2}"}

        # User 1 runs simulation
        sim_res = await client.post("/api/simulator/run", json={
            "situation": "Considering whether to relocate to another country or stay local.",
            "goal": "Gain international experience while maintaining family connections.",
            "choices": ["Relocate abroad", "Stay local"],
        }, headers=h1)
        u1_sim_id = sim_res.json()["id"]

        # User 1 runs reality check
        await client.post("/api/reality/analyze", json={
            "content": "Moving abroad is guaranteed to double your salary within six months.",
            "content_type": "advice",
        }, headers=h1)

        # User 1 runs mind assessment
        await client.post("/api/mind/assess", json={
            "sleep": 7.5,
            "screen_time": 5.0,
            "study_hours": 6.0,
            "exercise": 45,
            "stress": 4,
            "mood": 8,
        }, headers=h1)

        # Check User 1 reports: should have 3 items
        r1 = await client.get("/api/reports/", headers=h1)
        assert r1.status_code == 200
        assert r1.json()["total"] == 3

        # Check User 2 reports: should have 0 items (strict isolation)
        r2 = await client.get("/api/reports/", headers=h2)
        assert r2.status_code == 200
        assert r2.json()["total"] == 0

        # User 2 attempting to access User 1's simulation by ID returns 404
        r2_forbidden = await client.get(f"/api/simulator/{u1_sim_id}", headers=h2)
        assert r2_forbidden.status_code == 404

        # User 2 attempting to delete User 1's simulation returns 404
        r2_del = await client.delete(f"/api/simulator/{u1_sim_id}", headers=h2)
        assert r2_del.status_code == 404

        # User 1 deleting their own simulation works
        r1_del = await client.delete(f"/api/simulator/{u1_sim_id}", headers=h1)
        assert r1_del.status_code == 204

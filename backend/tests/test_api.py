from fastapi.testclient import TestClient
from app.main import app


def test_health_endpoint() -> None:
    with TestClient(app) as client:
        response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_scholarship_listing_is_empty_until_seeded() -> None:
    with TestClient(app) as client:
        response = client.get("/api/v1/scholarships")
    assert response.status_code == 200
    assert response.json() == []

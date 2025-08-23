from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from realty.api.models import UserProfile, Report


def auth_client(user: User) -> APIClient:
	client = APIClient()
	client.force_authenticate(user=user)
	return client


def test_profile_endpoint_returns_minimal_contract(db):
	user = User.objects.create_user(username="u@example.com", email="u@example.com", password="x")
	UserProfile.objects.get_or_create(user=user)
	client = auth_client(user)
	url = reverse("api:profile_me")
	resp = client.get(url)
	assert resp.status_code == 200
	data = resp.json()
	assert set(data.keys()) == {"id", "email", "role"}
	assert data["id"] == user.id
	assert data["email"] == "u@example.com"
	assert data["role"] in ("free", "paid", "admin")


def test_subscription_endpoint_contract(db):
	user = User.objects.create_user(username="sub@example.com", email="sub@example.com", password="x")
	UserProfile.objects.get_or_create(user=user)
	client = auth_client(user)
	url = reverse("api:my_subscription")
	resp = client.get(url)
	assert resp.status_code == 200
	data = resp.json()
	for key in ("status", "plan", "price_aed", "valid_until", "payment_method", "last_payment_at"):
		assert key in data


def test_reports_pagination_contract(db):
	user = User.objects.create_user(username="r@example.com", email="r@example.com", password="x")
	UserProfile.objects.get_or_create(user=user)
	# Создадим несколько отчетов
	for i in range(3):
		Report.objects.create(user=user, title=f"R{i}", status=Report.STATUS_READY)
	client = auth_client(user)
	url = reverse("api:reports_list") + "?limit=2&offset=0"
	resp = client.get(url)
	assert resp.status_code == 200
	data = resp.json()
	assert set(data.keys()) == {"count", "limit", "offset", "results"}
	assert data["limit"] == 2
	assert data["offset"] == 0
	assert isinstance(data["results"], list)
	if data["results"]:
		row = data["results"][0]
		assert {"id", "title", "status", "created_at", "updated_at"}.issubset(row.keys())

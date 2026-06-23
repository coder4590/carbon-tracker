import requests

BASE = "http://localhost:8080/api/v1"

# Register
requests.post(f"{BASE}/auth/register", json={
    "email": "demo@tracker.com",
    "password": "demo123",
    "full_name": "Demo Admin"
})

# Login
login = requests.post(f"{BASE}/auth/login", json={
    "email": "demo@tracker.com",
    "password": "demo123"
})
token = login.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# Create Emission Factors
factors_data = [
    {"name": "Grid Electricity", "category": "energy", "unit": "kgCO2/kWh", "value": 0.42, "source": "EPA eGRID 2024"},
    {"name": "Natural Gas", "category": "fuel", "unit": "kgCO2/m3", "value": 1.9, "source": "IPCC"},
    {"name": "Diesel", "category": "fuel", "unit": "kgCO2/L", "value": 2.68, "source": "EPA"},
    {"name": "Coal", "category": "fuel", "unit": "kgCO2/kg", "value": 2.42, "source": "IPCC"},
]

factor_ids = {}
print("Creating emission factors...")
for f in factors_data:
    res = requests.post(f"{BASE}/emissions/factors", json=f, headers=headers)
    factor_ids[f["name"]] = res.json()["id"]
    print(f"  {f['name']}: {f['value']} {f['unit']}")

# Create Factories with limits
factories_data = [
    {"name": "Steel Plant Alpha", "location": "Chicago, IL", "industry_type": "manufacturing", "annual_capacity": 500000, "emission_limit": 50000},
    {"name": "Chemical Plant Beta", "location": "Houston, TX", "industry_type": "chemical", "annual_capacity": 300000, "emission_limit": 40000},
    {"name": "Textile Mill Gamma", "location": "Atlanta, GA", "industry_type": "textile", "annual_capacity": 200000, "emission_limit": 30000},
    {"name": "Cement Factory Delta", "location": "Denver, CO", "industry_type": "construction", "annual_capacity": 400000, "emission_limit": 60000},
]

factory_ids = {}
print("\nCreating factories...")
for f in factories_data:
    res = requests.post(f"{BASE}/factories/", json=f, headers=headers)
    factory_ids[f["name"]] = res.json()["id"]
    print(f"  {f['name']}: {f['location']} (limit: {f['emission_limit']} kgCO2)")

# Create Emission Records (historical data)
import random
from datetime import datetime, timedelta

print("\nCreating emission records...")
records_count = 0

for factory_name, factory_id in factory_ids.items():
    for month in range(6):
        days = 28 if month % 2 == 0 else 31
        for day in range(1, days, 7):
            for factor_name in ["Grid Electricity", "Natural Gas"]:
                factor_id = factor_ids[factor_name]
                quantity = random.randint(1000, 10000)
                date = datetime(2026, month + 1, min(day, 28)).strftime("%Y-%m-%d")
                
                res = requests.post(f"{BASE}/emissions/records", json={
                    "factory_id": factory_id,
                    "emission_factor_id": factor_id,
                    "quantity": quantity,
                    "record_date": date + "T00:00:00",
                    "notes": ""
                }, headers=headers)
                if res.status_code == 201:
                    records_count += 1

print(f"\n✅ Done! Created {records_count} emission records")
print(f"✅ 4 factories with emission limits")
print(f"✅ 4 emission factors")
print(f"\nLogin: demo@tracker.com / demo123")
print(f"Dashboard: http://localhost:3000/dashboard")
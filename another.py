import csv

# Test CSV data
data = [
    ["factory_name", "emission_factor", "quantity", "date", "notes"],
    ["Steel Plant Alpha", "Electricity Grid", "15000", "2026-06-15", "Monthly electricity"],
    ["Steel Plant Alpha", "Natural Gas", "5000", "2026-06-15", "Gas consumption"],
    ["Chemical Plant Beta", "Electricity Grid", "20000", "2026-06-15", ""],
    ["Chemical Plant Beta", "Diesel", "3000", "2026-06-15", "Diesel for generators"],
    ["Textile Mill Gamma", "Electricity Grid", "8000", "2026-06-15", ""],
    ["Steel Plant Alpha", "Electricity Grid", "12000", "2026-06-16", ""],
    ["Chemical Plant Beta", "Natural Gas", "4000", "2026-06-16", "Weekly gas"],
    ["Textile Mill Gamma", "Diesel", "1500", "2026-06-16", ""],
    ["Steel Plant Alpha", "Diesel", "2500", "2026-06-17", "Backup generator"],
    ["Chemical Plant Beta", "Electricity Grid", "18000", "2026-06-17", ""],
]

# Write CSV file
with open("test_emissions.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(data)

print("✅ test_emissions.csv created with 10 records!")
"""Versioned daily reference targets from the supplied TECH factsheet.

These are dietary intake targets, not supplement doses. See
docs/nutrient-goals.md for corrections, units, and unsupported populations.
"""

import csv
from datetime import date
from decimal import Decimal
from functools import lru_cache
from pathlib import Path

RULE_VERSION = "tech-2026-10-v1"
REFERENCE_PATH = Path(__file__).resolve().parents[1] / "data/nutrient_reference.csv"
FIELDS = {
    "D": "vitamin_D", "B9": "vitamin_B9", "B12": "vitamin_B12",
    "B6": "vitamin_B6", "C": "vitamin_C", "E": "vitamin_E", "ALA": "omega3",
}
MASS_UNITS = {"g": Decimal(1), "mg": Decimal("0.001"), "ug": Decimal("0.000001")}


@lru_cache
def reference_rows() -> tuple[dict, ...]:
    with REFERENCE_PATH.open(encoding="utf-8-sig", newline="") as source:
        return tuple(csv.DictReader(source))


def calculate_targets(birth_date: str, sex: str, status: str, *, today: date | None = None) -> dict:
    today = today or date.today()
    born = date.fromisoformat(birth_date)
    age = today.year - born.year - ((today.month, today.day) < (born.month, born.day))
    if born > today or not 1 <= age <= 120:
        raise ValueError("Automatic nutrient goals currently support ages 1 through 120.")
    if sex not in {"male", "female", "other"}:
        raise ValueError("Select a valid sex before completing onboarding.")
    if status not in {"standard", "pregnancy", "lactation"}:
        raise ValueError("Select pregnancy/breastfeeding status in the health step.")
    if status != "standard" and not 14 <= age <= 50:
        raise ValueError("Pregnancy/breastfeeding targets in this reference support ages 14–50 only.")

    row_index = next(i for i, upper in enumerate((3, 8, 13, 18, 50, 120), start=2) if age <= upper)
    row = reference_rows()[row_index]
    goals, omitted = [], []
    for symbol, field in FIELDS.items():
        if symbol == "D":
            # NIH ODS: 15 ug through age 70; 20 ug from 71 onward.
            cell = "20 mcg" if age >= 71 else "15 mcg"
        elif symbol == "B9":
            suffix = {"standard": "", "pregnancy": "_pregnancy", "lactation": "_breastfeeding"}[status]
            cell = row[field + suffix]
        elif status != "standard":
            cell = row[field + "_" + status]
            if symbol == "B6":
                # Source CSV has mcg typos; NIH specifies mg for these rows.
                cell = "1.9 mg" if status == "pregnancy" else "2.0 mg"
        elif sex == "other":
            if row[field + "_male"] != row[field + "_female"]:
                omitted.append(symbol)
                continue
            cell = row[field + "_male"]
        else:
            cell = row[field + "_" + sex]
        if cell.strip() == "-1":
            raise ValueError(f"No reference target is available for {symbol} with this profile.")
        amount, unit = cell.split()
        goals.append({"symbol": symbol, "quantity": float(Decimal(amount)), "unit": normalize_unit(unit)})
    return {"goals": goals, "omitted_symbols": omitted, "age": age, "rule_version": RULE_VERSION}


def normalize_unit(unit: str) -> str:
    return unit.strip().lower().replace("μg", "ug").replace("µg", "ug").replace("mcg", "ug")


def resolve_goal_rows(targets: list[dict], nutrients: list[dict]) -> list[dict]:
    """Resolve stable symbols to actual database IDs, converting mass units only."""
    result = []
    for target in targets:
        matches = [n for n in nutrients if n.get("symbol") == target["symbol"]]
        if len(matches) != 1:
            raise ValueError(f"Expected one nutrient with symbol {target['symbol']}; apply the nutrient-goal migration.")
        nutrient = matches[0]
        unit = normalize_unit(nutrient.get("unit") or "")
        if unit not in MASS_UNITS:
            raise ValueError(f"Unsupported unit for {target['symbol']}: {unit}.")
        quantity = Decimal(str(target["quantity"])) * MASS_UNITS[target["unit"]] / MASS_UNITS[unit]
        result.append({"nutrient_id": nutrient["id"], "quantity": float(quantity)})
    return result

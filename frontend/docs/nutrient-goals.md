# Onboarding nutrient goals

## Flow, in order

1. Apply `supabase/migrations/20261001000000_onboarding_nutrient_goals.sql` to the target database before deploying the API/frontend. It adds status and calculation metadata, ensures the seven reference nutrients exist, and installs the transaction function. Existing nutrient IDs and units are preserved.
2. Onboarding collects age, sex, and an explicit pregnancy/breastfeeding status. Height, weight, and activity are still saved but do not change this reference table's targets.
3. Save the health step, including `nutrition_status` (`standard`, `pregnancy`, or `lactation`). Both desktop and mobile send this field.
4. The authenticated client calls the existing `POST /api/v1/onboarding/complete`. It never submits nutrient amounts or another user's ID.
5. The backend reads the saved profile and validates required fields. `calculate_targets` selects the factsheet age band and status/sex columns, with the documented corrections below.
6. Resolve D, B9, B12, B6, C, E, and ALA to database nutrient IDs by symbol. Convert mass units to the stored nutrient units. Missing/ambiguous references and unsupported units stop completion rather than storing zeros.
7. Call the service-role-only `complete_onboarding_with_goals` RPC. It locks the user row, checks that calculation inputs have not changed, upserts calculated goals, and marks onboarding complete in one transaction. Any failure rolls everything back. Goals unrelated to this calculation are preserved.
8. Redirect to the dashboard only after success. Failures stay in onboarding with a visible error and can be retried. Retries after initialization do not overwrite targets or custom edits. The rule version, input snapshot, omitted symbols, and generation time are recorded on the user.
9. Existing dashboard and vitamin-breakdown API queries can read the persisted `nutrient_goals`. Nutrients without logged intake may not appear in the current dashboard; rendering every goal is a separate UI improvement.

## Reference and deliberate corrections

Original attachment: `TECH -factsheet - Sheet1 (1).csv`, copied unchanged to
`backend/app/api/data/nutrient_reference.csv`. Runtime reads this repository copy,
not a developer's Downloads folder. Current rule version: `tech-2026-10-v1`.

- Vitamin D: the source groups all ages 51+ at 20 mcg. This implementation uses 15 mcg through age 70 and 20 mcg from age 71, per [NIH ODS Vitamin D, Table 2](https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/).
- Vitamin B6: pregnancy 1.9 and lactation 2.0 are **mg**, not the CSV's mcg. See [NIH ODS Vitamin B6, Table 1](https://ods.od.nih.gov/factsheets/VitaminB6-HealthProfessional/).
- Omega-3: for supported ages 1+, these reference targets describe **ALA**, not total omega-3, EPA/DHA, or total fat. They use a distinct `ALA` nutrient symbol. See [NIH ODS Omega-3](https://ods.od.nih.gov/factsheets/Omega3FattyAcids-Consumer/).
- Folate targets use dietary folate equivalents (DFE); the existing B9 food reference is also DFE. Vitamin E uses alpha-tocopherol. Do not substitute folic-acid-only quantities or IU without a nutrient-specific conversion.
- `mcg`, `ug`, `µg`, and `μg` mean the same mass unit. Only g/mg/ug conversions are supported; IU is rejected.
- `-1` means unavailable, never a negative target or zero intake.

## Initial scope and follow-ups

- Supports the app's current age range, 1–120. Infant rows remain in the original reference but are not used. Pregnancy/lactation rules are supported only for ages 14–50, where the sheet has complete coverage; unsupported profiles receive a validation error.
- For `sex=other` and standard status, only values identical in the male/female columns are generated. Differing targets are omitted, recorded in calculation metadata, and explained in onboarding. No male/female category is silently assigned. Pregnancy/lactation status selects those columns independently of sex.
- These are general daily dietary reference targets (RDA/AI), not supplement doses, deficiency treatments, or upper limits. Smoking, medical conditions, simultaneous pregnancy/lactation, and other adjustments are outside this version.
- No calorie, protein, carbohydrate, total-fat, or other nutrient targets are invented; the supplied sheet does not define them.
- The existing form asks for age and stores January 1 of the derived birth year. Therefore future birthday-based updates are approximate. Collect an actual date of birth before adding scheduled birthday recalculation.
- Initial generation happens on onboarding completion. Existing completed users are not silently backfilled. Add an explicit status collection/backfill flow for them, plus a deliberate recalculation path for later profile/status changes that respects clinician/user overrides.
- The migration does not populate food intake values for C or ALA. Goals can exist before those intake reference values are imported. Never compare ALA targets against total-fat or combined omega-3 intake.

## Validation and rollout

Run from `backend`: `.venv/Scripts/python.exe -m unittest discover -s tests -v`.
Tests cover age boundaries, birthdays, status-specific values, corrections, unit conversion,
unsupported profiles, missing reference rows, RPC failure, and duplicate completion requests.
Frontend validation: targeted ESLint and `tsc --noEmit --incremental false`.

The database migration must be applied separately. After applying it in a development database:

1. Complete a new user's onboarding and inspect `nutrient_goals` plus the user's calculation metadata.
2. Repeat `/complete` and confirm the row count and generation timestamp do not change.
3. Exercise a failing transaction in a disposable test database and verify neither goals nor completion are partially saved.
4. Confirm anonymous/authenticated clients cannot execute the transaction RPC directly.

The Python tests mock Supabase; they do not establish live PostgreSQL transaction behavior.

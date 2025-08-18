Goal: Implement/extend games defined in SPEC_PATH into src/, update data/, and add/adjust tests.
Constraints: pass Playwright, Lighthouse >= 0.90 mobile, zero critical axe issues, respect ops/policy.json.
Steps:
1) Read SPEC_PATH and list routes/components to change.
2) Generate code in-place. Keep diffs small.
3) If data files are missing fields, add safe defaults.
4) Update or create tests to cover new UI.
Output: modified files only; do not delete workflows.


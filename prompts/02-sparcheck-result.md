Goal:
Turn the Spar-Check into a real guided decision flow and build the result page as a prioritized recommendation screen.

Context:
- Read:
  - docs/page-briefs/spar-check.md
  - docs/page-briefs/ergebnis.md
  - docs/product-principles.md
- Inspect the current Spar-Check implementation and any existing state or calculation logic.
- The result must not be a dump of numbers. It must recommend a next step and explain why.

Constraints:
- Ask only for data that materially changes the next step
- Keep the flow short and legible
- Show progress clearly
- Persist answers locally in browser storage if possible
- Result page must contain:
  - a short summary of the household situation
  - the 1 most relevant next step
  - 1 alternative path
  - 1 low-pressure fallback path via Preis-Wächter
  - a small methodology / trust block
- Tarif-Vergleich must only appear as a recommended branch if the result logic supports it
- Avoid fake precision
- Explain the recommendation in plain language
- No login wall

Done when:
- Spar-Check feels like a guided product, not a landing page
- Result page gives clear direction, not generic options
- Users can understand why a path is recommended
- Users who are not ready to act have a legitimate fallback
- Lint/typecheck/build pass

# ADR 0006: Deterministic live cues; LLM only async
Status: Accepted (2026-11-09)

Context: A runner mid-race needs sub-second, correct, repeatable cues. LLMs
are slow, non-deterministic, and can invent numbers.

Decision: Live cues come from a tested rules engine (pace vs target, HR zone,
terrain lookahead). LLM work - post-run analysis, plan generation, rule
tuning suggestions - runs as pg-boss jobs, grounded in stored session data.
POPIA: explicit consent plus documented cross-border transfer justification
before any runner data reaches an LLM provider.

Consequences: The live path is unit-testable and cheap. The AI coach is a
consumer of clean data, not a dependency of the run itself.

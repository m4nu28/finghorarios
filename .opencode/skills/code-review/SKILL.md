---
name: code-review
description: Perform senior-level code reviews for FingHorarios, focusing on correctness, maintainability, architecture, performance and user impact.
---

# Purpose

Use this skill after writing or modifying code.

Review code as if approving a pull request for production.

Do not stop after finding syntax issues. Evaluate architecture, maintainability and long-term quality.

# Review principles

Review the code, not the author.

Be objective.

Explain why something should change.

Prefer concrete suggestions over generic criticism.

Prioritize issues by impact.

# Review order

Review in this order:

1. Correctness.
2. Business rules.
3. Security.
4. Performance.
5. Maintainability.
6. Readability.
7. User experience.
8. Documentation.

# Correctness

Check:

- Does the feature solve the requested problem?
- Are edge cases handled?
- Can invalid data reach the database?
- Are errors handled correctly?
- Are HTTP responses correct?
- Are imports idempotent?
- Does React stay synchronized with backend data?

# Architecture

Verify:

- Business logic remains in Django.
- React handles presentation.
- Components have one responsibility.
- APIs remain consistent.
- No duplicated logic.
- Existing project conventions are respected.

Flag unnecessary abstractions.

Avoid introducing patterns that are inconsistent with the project.

# Readability

Prefer code that is easy to understand.

Check:

- Function names.
- Variable names.
- Method size.
- Nesting depth.
- Duplication.
- Magic values.
- Comments that explain "why" instead of "what".

# Django review

Look for:

- Missing select_related().
- Missing prefetch_related().
- Queries inside loops.
- Missing transactions.
- Validation only in React.
- Missing database constraints.
- Model methods that do too much.
- Fat views.
- Incorrect HTTP status codes.

# React review

Look for:

- Large components.
- Duplicated state.
- Missing loading state.
- Missing empty state.
- Missing error state.
- Business rules implemented in React.
- Unnecessary re-renders.
- Poor accessibility.
- Poor responsive behavior.

# API review

Verify:

- Stable response shape.
- Useful error messages.
- Proper status codes.
- Input validation.
- Consistent field names.
- Predictable endpoints.

# Performance

Ask:

- Is there an N+1 query?
- Is unnecessary rendering happening?
- Is expensive work repeated?
- Is caching appropriate?
- Is a dependency excessive for the task?

Optimize only when justified.

# Security

Review:

- Validation.
- Permissions.
- CSRF.
- Secrets.
- File uploads.
- Remote URLs.
- HTML rendering.
- SQL injection risks.

Never trust frontend validation.

# Testing

Verify:

- New behavior has tests.
- Regression tests exist for fixed bugs.
- Important edge cases are covered.
- Tests are readable.
- Tests use realistic academic data.

# UX review

Review the feature as a student.

Ask:

- Is it obvious?
- Is feedback immediate?
- Is terminology correct?
- Does it work with long course names?
- Does it behave well on smaller screens?

# Review output

Structure reviews as:

## Critical issues

Must be fixed before merging.

## Important improvements

Strongly recommended.

## Minor improvements

Optional polish.

## Positive observations

Highlight good decisions too.

# Completion checklist

Before approving:

- Correctness verified.
- Architecture respected.
- No duplicated logic.
- Security considered.
- Performance reviewed.
- Tests updated.
- UX reviewed.
- Documentation updated if needed.

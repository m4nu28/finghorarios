Purpose

Use this skill whenever working on the Django backend of FingHorarios.

The backend is responsible for business rules, persistence, validation, scraping, API behavior and data integrity. React should never become the source of truth for business logic.

Core principles

Keep business logic in Django.

Keep views thin.

Prefer explicit code over clever abstractions.

Extend existing apps before creating new ones.

Reuse project conventions before introducing new patterns.

Optimize only after identifying a real bottleneck.

Models

Models represent domain concepts.

Examples:

Carrera

Materia

Grupo

Horario

Previatura

Plan

AcademicPeriod

ImportJob

Rules:

Singular model names.

snake_case fields.

PascalCase class names.

Add meaningful str methods.

Use choices/enums for controlled values.

Add database constraints for important invariants.

Never perform scraping or network calls inside model.save().

Queries

Prefer QuerySets and Managers for reusable filtering.

Always consider:

select_related()

prefetch_related()

exists()

values_list(..., flat=True)

Avoid queries inside loops.

Views

Views should:

Read request data.

Validate input.

Delegate business logic.

Return an HTTP response.

Avoid placing large algorithms inside views.

APIs

Return predictable JSON.

Use proper HTTP status codes.

Never expose tracebacks or SQL errors.

Keep response formats consistent.

Scraping

The Bedelía importer should be separated into stages:

Discover source.

Download.

Parse.

Normalize.

Validate.

Save.

Report.

Imports should be idempotent whenever possible.

React boundary

React is responsible for:

Rendering.

UI state.

Forms.

User interaction.

React should not implement academic rules that already exist in Django.

Validation

Always validate on the backend:

Required fields.

Dates.

Academic period.

Duplicate imports.

Referential integrity.

Testing

Before finishing a feature:

Run Django tests.

Check migrations.

Review queries.

Verify API responses.

Test edge cases.

Performance

Prefer readable code first.

Optimize with:

select_related

prefetch_related

bulk_create

bulk_update

only when appropriate.

Security

Never trust frontend validation.

Validate uploaded files.

Validate scraped content.

Use environment variables for secrets.

Avoid committing credentials.

Completion checklist

Before finishing:

Business logic stays in Django.

Queries are efficient.

API is consistent.

No duplicated logic.

Migrations created if models changed.

Tests updated when needed.

Code follows project conventions.

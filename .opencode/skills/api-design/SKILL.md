---
name: api-design
description: Design consistent, predictable and maintainable APIs between the Django backend and React frontend in FingHorarios.
---

# Purpose

Use this skill whenever creating, modifying or reviewing API endpoints.

The API should make frontend development simple without exposing backend implementation details.

# Core principles

- Keep endpoints resource-oriented.
- Use consistent naming.
- Use proper HTTP methods and status codes.
- Validate all important input in Django.
- Return predictable response shapes.
- Avoid leaking internal errors.
- Keep pagination, filters and ordering consistent.
- Do not duplicate business rules in React.

# URL design

Prefer clear nouns in plural form.

Good:

```text
/api/courses/
/api/courses/42/
/api/careers/
/api/academic-periods/
/api/schedules/
/api/prerequisites/
```

Avoid:

```text
/api/getCourses/
/api/createSchedule/
/api/doSearch/
/api/courseData/
```

Use nested routes only when the relationship is important and bounded.

Example:

```text
/api/careers/3/courses/
```

Avoid deeply nested URLs.

Bad:

```text
/api/careers/3/plans/2/years/1/courses/45/groups/
```

# HTTP methods

Use:

- `GET` to read.
- `POST` to create or run a meaningful command.
- `PUT` to replace a full resource.
- `PATCH` to partially update.
- `DELETE` to remove.

Do not use `POST` for simple reads.

# Status codes

Use:

- `200 OK` for successful reads and updates with a response body.
- `201 Created` for successful creation.
- `204 No Content` for successful deletion without a response body.
- `400 Bad Request` for invalid input.
- `401 Unauthorized` when authentication is required.
- `403 Forbidden` when access is denied.
- `404 Not Found` when a resource does not exist.
- `409 Conflict` for meaningful state conflicts.
- `422 Unprocessable Entity` only if the project deliberately standardizes on it.
- `500 Internal Server Error` only for unexpected failures.

Do not return `200` for every outcome.

# Response shape

Use a stable top-level structure.

Single resource:

```json
{
  "data": {
    "id": 42,
    "name": "Lógica"
  }
}
```

Collection:

```json
{
  "data": [
    {
      "id": 42,
      "name": "Lógica"
    }
  ],
  "meta": {
    "count": 1
  }
}
```

Error:

```json
{
  "error": {
    "code": "invalid_academic_period",
    "message": "El período académico no es válido.",
    "fields": {
      "academic_period": [
        "Seleccione un período existente."
      ]
    }
  }
}
```

Do not mix incompatible response formats between endpoints.

# Field naming

Use `snake_case` in JSON unless the existing project has already standardized another convention.

Examples:

```text
academic_period
course_code
start_time
end_time
source_url
```

Avoid abbreviations unless they are domain-standard and already used consistently.

# Dates and times

Use ISO 8601.

Examples:

```text
2026-07-21
18:30:00
2026-07-21T18:30:00-03:00
```

Include timezone information for datetimes when relevant.

Do not return localized display strings as the only representation of dates or times.

# Filtering

Use query parameters for collection filtering.

Examples:

```text
/api/courses/?career_id=3
/api/schedules/?academic_period=2026-sem1
/api/courses/?search=logica
```

Keep filter names explicit.

Document accepted values.

Ignore unknown filters only if the project has intentionally chosen that behavior. Otherwise return a clear validation error.

# Ordering

Use a consistent ordering parameter.

Example:

```text
/api/courses/?ordering=name
/api/courses/?ordering=-credits
```

Restrict ordering to allowed fields.

Never pass arbitrary field names directly into ORM ordering without validation.

# Pagination

Use pagination for potentially large collections.

Example:

```json
{
  "data": [],
  "meta": {
    "count": 125,
    "page": 1,
    "page_size": 20,
    "total_pages": 7
  }
}
```

Keep page size limits reasonable.

Do not paginate small, bounded reference lists unnecessarily.

# Search

Search endpoints should define what fields are searched.

Prefer a normal collection endpoint with a search parameter:

```text
/api/courses/?search=programacion
```

Use a dedicated search endpoint only when searching across multiple resource types or using special ranking behavior.

# Validation

Validate:

- Required fields.
- Field types.
- Identifier existence.
- Academic period validity.
- Duplicate relations.
- Schedule consistency.
- Allowed filter values.
- File type.
- Remote URL source.

Return field-level errors when possible.

Do not rely on frontend validation alone.

# Relationships

Avoid returning deeply nested full objects by default.

Prefer compact relationships:

```json
{
  "id": 42,
  "name": "Lógica",
  "career": {
    "id": 3,
    "name": "Ingeniería en Computación"
  }
}
```

For large related collections, expose a separate endpoint or compact summary.

Avoid circular response structures.

# Commands and operations

Some actions do not fit plain CRUD.

Examples:

- Generate schedule combinations.
- Import Bedelía schedules.
- Validate prerequisite selections.

Use explicit command endpoints when necessary.

Examples:

```text
POST /api/schedule-combinations/
POST /api/imports/
POST /api/prerequisite-checks/
```

Name commands after the resulting resource or operation, not generic verbs such as `execute` or `process`.

# Idempotency

Use idempotent behavior where practical.

Examples:

- Repeating the same import should not create duplicate schedules.
- Repeating a full replacement should produce the same state.
- Retrying a safe request should not corrupt data.

For long-running imports, consider returning a job resource.

Example:

```json
{
  "data": {
    "id": 18,
    "status": "pending"
  }
}
```

# Errors

Errors must be:

- Understandable.
- Stable enough for React to handle.
- Safe to expose.
- Written in Spanish for user-facing messages.

Use machine-readable codes.

Example:

```json
{
  "error": {
    "code": "schedule_conflict",
    "message": "Los grupos seleccionados tienen horarios superpuestos."
  }
}
```

Do not expose:

- Tracebacks.
- SQL.
- File paths.
- Environment variables.
- Internal class names.
- Raw third-party errors.

# Performance

Avoid N+1 queries.

Use `select_related` and `prefetch_related` appropriately.

Return only fields needed by the frontend.

Do not create many specialized endpoints when one well-filtered endpoint is enough.

Do not optimize response payloads at the cost of making the API inconsistent or difficult to understand.

# Versioning

Do not add API versioning prematurely.

Introduce versioning when incompatible public contracts must coexist.

If versioning becomes necessary, prefer a clear pattern such as:

```text
/api/v1/courses/
```

# Authentication and permissions

Most public FingHorarios information should remain readable without login.

When authentication is introduced:

- Enforce permissions in Django.
- Do not trust hidden frontend controls.
- Return `401` for missing authentication.
- Return `403` for authenticated users lacking permission.
- Avoid exposing private user data in public endpoints.

# Documentation

For every endpoint, document:

- Method.
- URL.
- Purpose.
- Query parameters.
- Request body.
- Success response.
- Error responses.
- Permission requirements.

Examples should use realistic FingHorarios data.

# Testing

Test:

- Successful requests.
- Invalid input.
- Missing resources.
- Permission failures.
- Filters.
- Ordering.
- Pagination.
- Duplicate creation.
- Academic rule conflicts.
- Response shape.
- Query counts for important endpoints.

# Completion checklist

Before considering an API change complete:

- URL and method are appropriate.
- Status codes are correct.
- Response shape matches project conventions.
- Validation exists in Django.
- Error codes and messages are useful.
- No internal details are exposed.
- Filters and ordering are validated.
- Query performance was considered.
- React does not need to duplicate business rules.
- Tests cover success and failure paths.
- Documentation or examples were updated.

---
name: testing
description: Apply practical backend and frontend testing standards for FingHorarios, prioritizing critical behavior, academic rules and regression prevention.
---

# Purpose

Use this skill whenever creating, modifying or reviewing tests in FingHorarios.

Tests should protect important behavior without becoming more complex than the application code itself.

# Core principles

- Test behavior, not implementation details.
- Prioritize critical user flows.
- Keep tests deterministic.
- Use realistic academic data.
- Cover success, failure and edge cases.
- Add regression tests for bugs.
- Avoid excessive mocking.
- Keep tests readable enough to serve as documentation.

# Testing priorities

Prioritize these areas:

1. Course and schedule imports.
2. Duplicate prevention.
3. Schedule combinations.
4. Overlap detection.
5. Career and prerequisite relations.
6. API validation.
7. Search and filtering.
8. Critical React interactions.
9. Error and empty states.
10. Accessibility of key controls.

# Test pyramid

Prefer:

- Many focused unit tests.
- A smaller number of integration tests.
- A few high-value end-to-end tests.

Do not try to cover everything through browser tests.

Use the lowest testing level that gives confidence in the behavior.

# Django unit tests

Use Django test classes or pytest according to the existing project conventions.

Test model and domain behavior directly.

Examples:

- A prerequisite cannot reference the same course.
- Reimporting the same schedule does not create duplicates.
- A schedule start time must precede its end time.
- A course query returns only the requested academic period.
- Schedule overlap detection handles boundaries correctly.

Prefer explicit test names.

Good:

```python
def test_importing_same_source_twice_does_not_duplicate_groups():
    ...
```

Avoid vague names:

```python
def test_import():
    ...
```

# Django API tests

For each important endpoint, test:

- Successful response.
- Invalid input.
- Missing resource.
- Duplicate submission.
- Filtering.
- Ordering.
- Pagination when applicable.
- Correct status code.
- Correct response shape.
- Permission behavior when applicable.

Example:

```python
def test_course_list_filters_by_career(api_client, career, course):
    response = api_client.get(
        "/api/courses/",
        {"career_id": career.id},
    )

    assert response.status_code == 200
    assert response.json()["data"][0]["id"] == course.id
```

Do not assert only the status code when the response contract matters.

# Database tests

Use realistic relationships.

Examples:

- A career with multiple plans.
- A course belonging to more than one career.
- Several groups for one course.
- Overlapping and non-overlapping schedules.
- Long course names.
- Prerequisite chains.

Use factories or helper builders when they reduce repetition.

Do not hide important test setup behind overly generic helpers.

# Import and scraping tests

Separate tests by stage:

1. Source discovery.
2. Download behavior.
3. Parsing.
4. Normalization.
5. Validation.
6. Persistence.
7. Import reporting.

Do not depend on live Bedelía pages in normal test runs.

Use saved fixtures or small representative source files.

Test malformed input.

Examples:

- Missing course code.
- Unexpected PDF column layout.
- Empty page.
- Duplicate group.
- Invalid time.
- Unknown academic period.
- Partial row.

Test that malformed rows are reported rather than silently discarded.

# Idempotency tests

Imports must be tested for repeated execution.

Example expectation:

```python
run_import(source)
run_import(source)

assert Group.objects.count() == expected_group_count
```

Also verify whether existing records are updated correctly when source data changes.

# Transaction tests

Use transaction-aware tests when behavior depends on rollback or atomicity.

Verify that partial failures do not leave inconsistent data.

Example:

- If one step of an import fails, no half-created schedule set remains.

# Query performance tests

For important list endpoints or algorithms, consider query-count assertions.

Example:

```python
with self.assertNumQueries(3):
    response = self.client.get("/api/courses/")
```

Do not overuse exact query counts for trivial code because they can make tests brittle.

Use them where N+1 regressions would be costly.

# React component tests

Test components as users interact with them.

Prefer queries by:

- Role.
- Label.
- Visible text.
- Accessible name.

Avoid selecting elements by implementation-specific class names.

Good:

```javascript
screen.getByRole("button", { name: /agregar materia/i })
```

Avoid:

```javascript
container.querySelector(".btn-primary")
```

Test:

- Search input.
- Course selection.
- Filter changes.
- Loading state.
- Empty state.
- Error state.
- Retry behavior.
- Keyboard interaction.
- URL synchronization when applicable.

# React integration tests

Use integration tests for feature-level flows.

Examples:

- Search for a course and add it to the schedule.
- Select a career and load its courses.
- Apply filters and preserve them in the URL.
- Receive an API validation error and display it near the field.
- Retry after a failed request.

Mock the network boundary, not internal component functions.

# End-to-end tests

Keep end-to-end coverage focused.

Recommended flows:

- Open the application and search for a course.
- Select multiple courses and generate schedule combinations.
- Explore a career and its prerequisites.
- Recover from a failed API request.
- Verify a critical mobile interaction.

Do not duplicate every unit and integration scenario in end-to-end tests.

# Accessibility tests

Test accessibility of critical controls.

Verify:

- Inputs have labels.
- Buttons have accessible names.
- Dialogs receive focus.
- Keyboard navigation works.
- Errors are announced or associated with fields.
- Interactive elements are not plain clickable divs.

Automated checks do not replace manual keyboard review.

# Edge cases

Always consider:

- Empty database.
- No schedules for a period.
- One course with many groups.
- Very long names.
- Consecutive schedules.
- Exact boundary overlaps.
- Duplicate prerequisites.
- Cyclic prerequisite data.
- Network timeout.
- Malformed API response.
- Slow request.
- User changing filters rapidly.

# Mocking

Mock external boundaries:

- HTTP requests.
- File downloads.
- Time when necessary.
- Third-party services.

Avoid mocking:

- The function under test.
- Simple domain objects.
- Django ORM behavior unless unavoidable.
- Internal implementation details.

Too much mocking can produce tests that pass while the feature is broken.

# Fixtures and factories

Use factories when many tests need variations of the same models.

Use fixtures for:

- Representative PDF samples.
- Stable JSON examples.
- Complex data sets that should not be rebuilt manually.

Keep fixtures small and understandable.

Avoid massive fixtures copied from production.

# Test data

Use realistic FING terminology.

Examples:

- Lógica.
- Programación 4.
- Ingeniería en Computación.
- Semestre 1 de 2026.
- Grupo práctico.
- Grupo teórico.

Do not use meaningless data such as `foo`, `bar` or `test1` when domain-relevant names improve clarity.

# Regression tests

Every fixed bug should receive a test when practical.

The test name should describe the previous failure.

Example:

```python
def test_schedule_import_does_not_duplicate_group_when_pdf_is_reimported():
    ...
```

A regression test should fail before the fix and pass after it.

# Test structure

Use Arrange, Act, Assert where helpful.

Example:

```python
def test_courses_are_ordered_by_name():
    # Arrange
    Course.objects.create(name="Programación 4")
    Course.objects.create(name="Lógica")

    # Act
    result = list(Course.objects.order_by("name"))

    # Assert
    assert [course.name for course in result] == [
        "Lógica",
        "Programación 4",
    ]
```

Do not add comments when the structure is already obvious.

# Test independence

Tests must not depend on execution order.

Each test should create or receive the state it needs.

Avoid shared mutable global state.

Clean up temporary files and patched environment variables.

# Determinism

Avoid tests that depend on:

- Current date without freezing time.
- Random data without a fixed seed.
- Live network requests.
- Local machine paths.
- Unordered database results.
- Timing-sensitive sleeps.

Make ordering explicit when asserting collections.

# Test commands

Use the project’s existing commands.

Typical backend commands:

```bash
python manage.py test
```

or:

```bash
pytest
```

Typical frontend commands:

```bash
npm test
```

or:

```bash
npm run test
```

Also run linters or type checks when configured.

Do not invent commands without checking `package.json`, project settings or existing documentation.

# Coverage

Coverage is a signal, not the goal.

Prioritize meaningful assertions over a high percentage.

Do not add low-value tests only to increase coverage numbers.

Focus coverage on:

- Domain logic.
- Imports.
- API contracts.
- Critical UI flows.
- Previously broken behavior.

# Completion checklist

Before considering a tested feature complete:

- Critical success behavior is covered.
- Important validation failures are covered.
- Edge cases were considered.
- External services are not required for normal tests.
- Import behavior is idempotent.
- API response shape is asserted.
- React tests use accessible queries.
- Regression tests were added for fixed bugs.
- Tests do not depend on order or live data.
- Relevant test commands were run.
- Any untested limitation is stated explicitly.

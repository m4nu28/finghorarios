---
name: react-architecture
description: Apply maintainable React architecture and frontend engineering conventions when creating or modifying the FingHorarios frontend.
---

# Purpose

Use this skill whenever working on React components, pages, hooks, API communication, routing, forms, state management or frontend tests in FingHorarios.

React is responsible for presentation, interaction and temporary UI state. Django remains the source of truth for business rules, persistence and academic data validation.

# Core principles

- Inspect the existing frontend structure before adding files.
- Reuse existing components and patterns.
- Keep components focused.
- Keep state as local as possible.
- Separate API communication from visual components.
- Do not duplicate Django business logic in React.
- Prefer simple React patterns before adding libraries or abstractions.
- Build for realistic academic data, not only ideal mock data.

# Component responsibilities

A component should have one clear responsibility.

Good component examples:

- CourseSearch
- CourseResultList
- ScheduleGrid
- ScheduleCell
- CareerSelector
- PrerequisiteGraph
- AcademicPeriodSelector
- LoadingState
- EmptyState
- ErrorState

Avoid components that combine:

- API calls.
- Complex data transformation.
- Form validation.
- Large page layouts.
- Business rules.
- Many unrelated interactions.

When a component becomes difficult to understand, extract behavior based on responsibilities rather than file length alone.

# Component organization

Prefer organizing code by feature or domain.

Example:

```text
src/
├── api/
├── components/
├── features/
│   ├── courses/
│   ├── schedules/
│   ├── careers/
│   └── prerequisites/
├── hooks/
├── pages/
└── utils/
```

Do not create a generic abstraction directory unless there is a clear repeated need.

Avoid folders containing unrelated components only because they share a technical type.

# State management

Keep state local by default.

Use component state for:

- Open or closed menus.
- Selected tabs.
- Temporary input.
- Hover and focus behavior.
- Draft form values.

Use lifted state when sibling components must coordinate.

Use context only for state shared across a meaningful subtree.

Do not add Redux, Zustand or another global state library unless the existing project genuinely requires complex shared state.

Separate:

- Server state.
- URL state.
- Form state.
- Temporary UI state.

Do not duplicate the same source of truth in multiple states.

# URL state

Use the URL for state users may want to:

- Share.
- Bookmark.
- Restore after refreshing.
- Navigate backward and forward through.

Examples:

- Selected career.
- Academic period.
- Selected courses.
- Search filters.
- Current tool or module.

Do not hide important navigation state only inside React memory.

# API communication

Keep API requests in a dedicated module or feature-level API file.

Example:

```javascript
export async function fetchCourses(params = {}) {
  const query = new URLSearchParams(params);
  const response = await fetch(`/api/courses/?${query}`);

  if (!response.ok) {
    throw new Error("No se pudieron cargar las materias.");
  }

  return response.json();
}
```

Avoid writing repeated `fetch()` logic directly inside many visual components.

Handle:

- Loading.
- Empty results.
- Expected errors.
- Unexpected errors.
- Request cancellation when appropriate.
- Stale responses when searches happen quickly.

Never assume a successful response without checking `response.ok`.

Do not expose backend implementation details in user-facing error messages.

# Data transformation

Keep small presentational transformations close to the component.

Move complex or reusable transformations into dedicated functions.

Examples:

- Grouping schedules by weekday.
- Sorting groups by start time.
- Building a prerequisite graph.
- Detecting visual timetable overlaps.
- Formatting academic periods.

Do not implement academic validation rules in these transformations if Django already owns them.

# Hooks

Create custom hooks when logic is:

- Reused.
- Stateful.
- Side-effect driven.
- Easier to test separately.
- Distracting from component rendering.

Use the `use...` prefix.

Examples:

- useCourseSearch
- useAcademicPeriod
- useScheduleSelection
- useUrlFilters

Do not create a hook that only wraps one trivial line without improving clarity.

Hooks should expose a small and understandable interface.

# Effects

Use `useEffect` only for synchronization with external systems.

Appropriate uses:

- API requests.
- Event listeners.
- Browser APIs.
- URL synchronization.
- Timers.
- Third-party widgets.

Do not use effects for values that can be derived during rendering.

Bad:

```javascript
useEffect(() => {
  setFilteredCourses(filterCourses(courses, query));
}, [courses, query]);
```

Better:

```javascript
const filteredCourses = filterCourses(courses, query);
```

Clean up subscriptions, timers and event listeners.

# Forms

Use controlled or uncontrolled forms consistently within a feature.

Validate basic interaction requirements in React for immediate feedback.

Always rely on Django for authoritative validation.

Display field errors near their controls.

Do not clear user input after an unsuccessful submission.

Prevent duplicate submissions while a request is pending.

Use clear labels and native form elements.

# Rendering lists

Use stable identifiers as React keys.

Good:

```jsx
groups.map((group) => (
  <ScheduleGroup key={group.id} group={group} />
))
```

Avoid array indexes when order can change.

Handle long lists with pagination, filtering or virtualization only when necessary.

# Styling

Follow the frontend design skill and existing project styling approach.

Prioritize:

- Typography.
- Alignment.
- Spacing.
- Information hierarchy.
- Readable density.
- Responsive behavior.

Avoid:

- Generic dashboard layouts.
- Excessive cards.
- Decorative gradients.
- Glassmorphism.
- Unnecessary animations.
- Large empty hero sections inside application tools.
- Repeated UI patterns generated without product context.

Do not introduce a second styling system without a concrete migration plan.

# Accessibility

Use semantic HTML first.

Requirements:

- Buttons for actions.
- Links for navigation.
- Labels associated with controls.
- Keyboard-accessible interactions.
- Visible focus states.
- Correct heading order.
- Useful alternative text.
- Accessible error messages.
- Do not communicate status using color alone.

Avoid clickable `div` elements.

Use ARIA only when native HTML cannot express the interaction.

# Responsive design

Design for realistic laptop and mobile widths.

Do not simply shrink the desktop layout.

For dense schedules:

- Preserve course names and times.
- Allow horizontal scrolling when it is more usable than squeezing content.
- Keep controls reachable.
- Avoid tiny text.
- Test long subject names.
- Test many groups at the same time.

# Performance

Do not optimize prematurely.

Before adding memoization, verify that rendering is actually expensive.

Use `useMemo`, `useCallback` and `memo` only when they solve a measured or clear rendering problem.

Avoid:

- Recreating large transformed datasets unnecessarily.
- Fetching the same endpoint repeatedly.
- Rendering hidden heavy components.
- Large frontend dependencies for small tasks.

Prefer code splitting for genuinely large routes or tools.

# Error handling

Every data-driven page must consider:

- Initial loading.
- Empty state.
- Recoverable error.
- Unexpected error.
- Partial data.
- Retry behavior.

Error messages must be useful and written in Spanish.

Avoid generic messages such as “Something went wrong” when a clearer message is possible.

# Testing

Test behavior rather than implementation details.

Prioritize:

- Critical user flows.
- Search and filtering.
- Course selection.
- Schedule combination.
- Error states.
- Empty states.
- Form validation.
- URL state.
- Accessibility of key controls.

Do not overuse snapshots.

Prefer tests that interact with the UI as a user would.

# Dependencies

Before installing a frontend dependency:

1. Check whether the browser or React already provides the capability.
2. Check whether the project already has a suitable library.
3. Confirm the package is maintained.
4. Consider bundle size.
5. Explain why it is necessary.

Do not add a large component library only for one control.

# Completion checklist

Before considering frontend work complete:

- The component has a clear responsibility.
- Django business logic was not duplicated.
- API calls are separated from presentation where appropriate.
- Loading, empty, error and success states exist.
- The layout works with realistic data.
- Keyboard navigation works.
- Focus states are visible.
- URL state is used when sharing or persistence matters.
- No unnecessary dependency was added.
- Relevant tests were run or updated.
- Modified files and limitations are summarized.

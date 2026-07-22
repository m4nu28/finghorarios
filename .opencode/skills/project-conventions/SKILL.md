---
name: project-conventions
description: Apply the project-specific architecture, terminology, coding conventions and product rules for the FingHorarios Django and React application.
---

# Project overview

FingHorarios is a web application for students of Facultad de Ingeniería, Udelar.

Its main goals are:

- Display course schedules.
- Help students compare and combine subjects.
- Show careers and prerequisite relationships.
- Support academic planning.
- Present information clearly and quickly without requiring login.

The application is a practical student tool, not a generic SaaS product.

# General workflow

Before modifying code:

1. Inspect the existing project structure.
2. Read the relevant models, views, serializers, components and styles.
3. Identify existing conventions.
4. Reuse existing patterns where reasonable.
5. Propose the smallest coherent implementation.
6. Avoid introducing a new architecture when the current one is sufficient.

Do not assume that a file, component, endpoint or model does not exist before searching for it.

Prefer consistency with the repository over introducing a theoretically cleaner but incompatible pattern.

# Architecture

## Backend

- Use Python and Django.
- Django owns business logic.
- Django owns database validation.
- Django owns permissions and authorization.
- Django owns persistence and data integrity.
- Keep views focused on request and response handling.
- Use the Django ORM before considering raw SQL.
- Avoid duplicating backend rules in React.
- Use database constraints for rules that must always hold.
- Avoid queries inside loops.
- Use `select_related` and `prefetch_related` when appropriate.

## Frontend

- Use React for presentation and interaction.
- Keep API communication separate from purely visual components.
- Do not duplicate Django business logic in React.
- Reuse existing components before creating new ones.
- Keep state as local as possible.
- Separate server state from temporary UI state.
- Avoid unnecessary global state.
- Avoid large components that mix API calls, layout, validation and business logic.

# Naming conventions

## Python and Django

Use:

- `snake_case` for variables and functions.
- `PascalCase` for classes.
- Clear domain-specific names.
- Singular names for models.
- Plural names for collections.

Avoid abbreviations unless they are already established in the project.

## JavaScript and React

Use:

- `camelCase` for variables and functions.
- `PascalCase` for components.
- Descriptive component names.
- `use...` prefix for custom hooks.

## API

- Use `snake_case` in JSON fields unless the existing API already follows another convention.
- Use ISO 8601 for dates and datetimes.
- Keep response structures consistent.
- Avoid returning implementation details that the frontend does not need.

# Project terminology

Use terminology familiar to FING and Udelar students.

Prefer:

- Materia
- Carrera
- Horario
- Grupo
- Curso
- Previatura
- Parcial
- Examen
- Crédito
- Semestre
- Período
- Aprobada
- Exonerada
- Inscripción

Avoid replacing these terms with generic software or SaaS language such as:

- Product
- Asset
- Customer
- Workspace
- Resource
- Pipeline
- Conversion
- Engagement

All user-visible text must be written in Spanish unless there is a clear product requirement for another language.

# Product behavior

- The main information should be accessible without login.
- Do not introduce authentication unless a feature genuinely requires persistence or private user data.
- Optimize for quick consultation.
- Avoid unnecessary setup flows.
- Avoid onboarding screens for simple features.
- Do not invent academic rules.
- Do not invent course data.
- Use realistic FING terminology and examples when mock data is necessary.

# Frontend identity

The interface should feel like an independent student tool.

It should be:

- Clear.
- Practical.
- Fast.
- Trustworthy.
- Specific to the university context.
- Visually intentional without being flashy.

It should not feel like:

- A generic SaaS dashboard.
- A cryptocurrency application.
- A startup landing page.
- An official institutional system.
- A template generated without understanding the product.

# Visual rules

- Prefer typography, alignment and spacing over decoration.
- Use a restrained palette.
- Use one main accent color unless the existing design requires more.
- Avoid excessive rounded corners.
- Avoid wrapping every section in a card.
- Avoid glassmorphism.
- Avoid large decorative gradients.
- Avoid floating blobs.
- Avoid neon effects.
- Avoid fake metrics.
- Avoid generic testimonials.
- Avoid decorative icons without meaning.
- Avoid oversized marketing headings.
- Avoid excessive whitespace that reduces information density.
- Use animation only when it explains state or interaction.

# Dependencies

Before adding a dependency:

1. Check whether the project already solves the problem.
2. Check whether the platform or standard library is sufficient.
3. Explain why the dependency is necessary.
4. Prefer established and maintained libraries.
5. Avoid adding a large library for a small feature.

Do not replace an existing dependency without a concrete benefit and migration plan.

# Error handling

- Handle expected errors explicitly.
- Do not silently ignore failures.
- Return useful API error messages.
- Show understandable frontend feedback.
- Consider loading, empty, error and success states.
- Log enough backend context to diagnose failures without exposing sensitive data.

# Security

- Validate all important data in Django.
- Do not trust frontend validation alone.
- Enforce permissions in the backend.
- Avoid exposing secrets in the frontend.
- Avoid committing credentials or tokens.
- Use environment variables for secrets.
- Be careful with scraping inputs, uploaded files and remote URLs.
- Do not render untrusted HTML without sanitization.

# Accessibility

- Use semantic HTML.
- Ensure keyboard navigation.
- Provide visible focus states.
- Associate labels with form controls.
- Use ARIA only when native HTML is insufficient.
- Maintain readable contrast.
- Do not communicate state using color alone.
- Respect reduced-motion preferences.

# Completion checklist

Before considering a task complete:

- Confirm the implementation follows existing project conventions.
- Check that backend and frontend responsibilities are correctly separated.
- Check loading, empty, error and success states.
- Check responsive behavior.
- Check long labels and realistic data.
- Check for duplicated logic.
- Check for unnecessary dependencies.
- Run relevant tests and linters when available.
- Summarize modified files and important decisions.
- Mention anything that could not be verified.

# Architecture

Angular 21 standalone components, lazy routes, signals, HttpClient and Angular CDK.

## Frontend boundaries

| Directory | Responsibility |
|---|---|
| `src/core/http` | HTTP error mapping and expired-session handling |
| `src/core/session` | Current account state |
| `src/core/guards` | Authenticated route guard |
| `src/layout` | Header, navigation and application shell |
| `src/features/auth` | Login/register pages, form, models, API service and auth store |
| `src/features/checklists` | Overview/archive/detail pages, list components, models, API and stores |
| `src/features/items` | Item editor, inline editing, filter toolbar, drag/drop list, models and API |
| `src/shared/components` | Dialog, confirmation, empty state, feedback and toast outlet |
| `src/shared/services` | Notification queue and undo actions |
| `src/shared/pipes` | Persian number formatting |
| `src/shared/utils` | Per-page asynchronous state |

A page coordinates a feature store and presentational components. Components receive typed inputs and emit typed events; they do not make HTTP requests. API services are the only frontend classes importing HttpClient. Stores compose requests with `firstValueFrom` and maintain signal state. Feature data models are separate files. Lazy routes keep auth, list overview and detail screens separate.

`App` only hosts the router and notifications. The session guard relies on the auth feature's session check; session state itself is independent of feature UI. Shared code must not import feature components or APIs. Items is a checklist-owned domain feature, not a generic shared component collection.

## Backend boundaries

| Directory/file | Responsibility |
|---|---|
| `auth.ts`, `auth.module.ts` | Session authentication, login/register and guard |
| `lists/` | Typed list DTOs, thin controller, list service and ownership lock |
| `items/` | Typed item DTOs, thin controller and item service |
| `checklists.module.ts` | Wires list and item domain providers |
| `database.module.ts`, `prisma.service.ts` | Prisma lifecycle and database access |
| `prisma/migrations/` | Versioned, additive schema upgrades |

Controllers extract validated route/body parameters and the authenticated user ID. Services own persistence and business rules. Every item mutation locks the parent list inside a transaction and checks its owner and archive status. Reordering requires the complete current active-item ID set; stale, duplicated or foreign IDs are rejected before writing. List archive/delete/restore operations share the same parent lock.

## Data semantics

- `description` belongs to a list; `notes`, `priority`, `dueDate` and `position` belong to an item.
- Due dates are date-only ISO strings (`YYYY-MM-DD`), with no timezone conversion. The date input is Gregorian; displayed dates use the Persian locale/calendar. There is no scheduled reminder.
- Deletion is soft (`deletedAt`). List deletion does not erase its items. Restoring a list preserves separately deleted items as deleted.
- Undo notifications remain until acted on, dismissed, page refresh or logout. There is no trash browser or retention cleanup job in this version. Deleted rows remain in PostgreSQL.
- Restoring an item uses its saved position and normalizes active positions. Existing item ordering is preserved by the migration.
- Archived lists remain searchable/viewable. Unarchive before changing their items. List metadata can still be edited.
- Ordering is disabled while a search/filter hides items. Reordering writes only after server validation; failures retain the previous visible order.

## Extending a feature

1. Add typed models and API methods in its `models` and `data-access` folders.
2. Add state orchestration to a feature store, not a generic HTTP wrapper or root component.
3. Add focused components under the feature's `components`, and coordinate them from `pages`.
4. Promote a component to `shared` only when it has no domain dependency and is reused.
5. Change Prisma schema through a new migration; never edit a migration already applied by users.
6. Keep authorization and validation on the server even when the UI disables an action.

## List types

`Checklist.type` is `TASK`, `SHOPPING` or `SIMPLE`; the default is `TASK` for backwards compatibility. The type is selected at creation and is immutable. This avoids silent loss or hiding of existing metadata when changing types.

- TASK: item title/completion, notes, priority and date.
- SHOPPING: item title/completion, quantity, free-text unit and optional estimated price **per unit**. There is no currency conversion or automatic total in this release.
- SIMPLE: title and completion; normal ordering, search, archive and Undo still apply.

`item-type-policy.ts` enforces the allowed field groups on create/update, after authorization and within the parent-list transaction. Hidden fields sent directly to the API are rejected. `quantity` uses PostgreSQL Decimal(12,3), `estimatedPrice` uses Decimal(12,2). API request values are JSON numbers; Prisma response decimals are strings, reflected in frontend models. Positive quantity/nonnegative price are validated in DTOs and backed by database constraints. Quick-add shopping defaults to quantity 1, unit «عدد», price null; zero price is distinct from an unspecified price.

The type picker lives in the checklist feature. Item components receive a typed `listType` input and render only applicable fields. List editing excludes `type` from the update payload.

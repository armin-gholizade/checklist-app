# Verification — feature-based release

## Passed

- Angular production build with lazy chunks and strict template checking.
- NestJS TypeScript compilation.
- Seven focused unit tests: missing/forged/expired sessions, ownership lock, invalid request fields, boolean validation, password hashing/session cookie and duplicate account handling.
- 33 HTTP assertions through the running NestJS + Prisma API: registration, ownership isolation, item metadata, invalid date/priority/null title, persistent ordering, invalid reorder sets, soft deletion and restoration, archive restrictions and legacy account access.
- Migration SQL applied to a database containing records in the original schema. Existing user, list, item titles and item creation order were preserved; new defaults were populated.
- Live Chromium flow against the same running API: registration, list description, item notes/priority/date, inline editing, arrow-button sorting, drag sorting, reload persistence, status filters, note search, item Undo, list Undo, archive/unarchive, and a 390px mobile viewport without document overflow.
- Desktop and mobile screenshots visually inspected. No uncaught page errors in the tested flow.

## Environment and limits

The integration database was **PGlite** (PostgreSQL compiled to WASM) exposed through a PostgreSQL socket to the normal Prisma client. It is a test-only dependency outside the shipped project; the application still uses Docker PostgreSQL 17 locally. Tests did not use mocked HTTP responses.

A native Docker PostgreSQL instance and the user's Windows environment were not available here. PGlite's socket multiplexer does not reproduce native PostgreSQL's multi-process concurrency; simultaneous-client contention is not covered. Duplicate registration was checked by a unit test; a PGlite socket error following a unique-key violation prevented including that case in the live database suite. The 33 API checks exclude this duplicate-registration case.

Migration SQL was executed directly in the test database. The user's Prisma migration deployment command and Docker startup remain local verification steps.

## Repeatable checks

`npm run build` then `node --test tests/security.test.cjs`.

Run `tests/api.integration.mjs` against an isolated API using `TEST_API_URL`; it creates two test accounts and test records. The optional `TEST_LEGACY=1` branch expects the documented test fixture account and is for the internal migration harness, not a normal installation.

## List types release

- Production builds for Angular and NestJS passed again, together with the seven security unit tests.
- 39 additional live API checks passed for TASK, SHOPPING and SIMPLE: field isolation, immutable list type, decimal precision and bounds, quantity defaults, zero versus missing price, edits, checkboxes and delete/restore preservation.
- Live Chromium checks passed for creating all three types, conditional forms, invalid quantity validation, decimal persistence after reload, clearing prices, editing list titles, Undo, simple checkboxes and task metadata. No uncaught browser errors; the 390px shopping view had no horizontal overflow.
- The new migration was applied after the original and feature migrations to seeded legacy records. Existing lists received TASK and retained their content.
- The same PGlite and native-Docker/Windows limitations above apply. Repeat the type API checks against an isolated running API with `node tests/list-types.integration.mjs` (optionally set `TEST_API_URL`).

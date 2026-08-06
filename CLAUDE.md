# CLAUDE.md

## Project Overview

Cloud Inventory is a Red Hat Insights micro-frontend for viewing cloud account inventory, gold images, and marketplace purchases, served on `console.redhat.com` at `/subscriptions/cloud-inventory`. Built with React/TypeScript and loaded into the Insights Chrome shell via Webpack Module Federation (`fec` CLI).

## Common Commands

- `npm run start` — dev server with proxy (requires Red Hat VPN + proxy setup)
- `npm run build` — production build
- `npm run test` — run Jest tests
- `npm run lint` — ESLint
- `npm run verify` — build + lint + test (full CI check)

## Architecture & Conventions

- Functional components only, arrow functions, typed with `FC<Props>` or inline prop interfaces
- PascalCase directories for Components and Pages; lowercase for hooks, utils, state, types
- PatternFly v6 for UI components (`@patternfly/react-core`, `@patternfly/react-table`, `@patternfly/react-icons`)
- Plain SCSS — custom styles auto-scoped under `.cloud-inventory` / `.cloudInventory` by `fec.config.js`
- Native `fetch` + TanStack React Query v5 for data fetching; auth handled by the Chrome shell (no explicit token management needed in API calls)
- React Router v6 with lazy loading for page-level routes
- No Redux — React Query for server state, Jotai atoms for client-side filter/pagination state, React Context for notifications
- URL-synced state: use `useQueryParamInformedAtom(atom, key)` to two-way sync a Jotai atom with a URL query parameter, or `useQueryParamInformedState(init, key)` for the same pattern with local `useState`. Both initialize from the URL on mount and update the URL on every setter call. Multiple query-param setters in the same tick are batched into a single URL update
- Authorization via Kessel (`@project-kessel/react-kessel-access-check`) for relation-based access control; see `useHasRelation` hook
- ESLint flat config with `sort-imports` rule (declaration sort is ignored, but member sort is enforced)
- Prefer code reuse over duplication — extract shared logic into hooks or utilities
- Prefer small, focused React components over large complex ones
- Stay in scope — do not refactor or "improve" unrelated code when working on a feature

## Testing

- Jest 30 with ts-jest + React Testing Library
- Tests colocated in `__tests__/` subdirectories next to the code they test
- Coverage thresholds: 85% across branches, functions, and lines
- New features must include unit tests
- Do NOT use snapshot tests — test observable behavior and functionality (what the user sees and does), not implementation details (internal state, component structure, CSS classes)
- Pre-existing test failures are a code smell — if existing tests break after your changes, investigate the unintended consequences rather than just updating the test to pass

### Built-in Test Utilities

Use the app's testing helpers instead of reimplementing wrappers:

- **`renderWithRouter(ui)`** (`src/utils/testing/customRender.tsx`) — drop-in replacement for RTL's `render` that wraps the component in a `BrowserRouter`. Use for any component that uses routing or `useSearchParams`
- **`renderHookWithRouter(hook)`** (`src/utils/testing/customRender.tsx`) — same as above but for `renderHook`. Composes with a custom wrapper option if you need additional providers
- **`expectToThrow(fn)`** (`src/utils/testing/expectToThrow.ts`) — wraps an async function expected to throw, suppressing React's noisy `console.error` output during the test
- **`HydrateAtomsTestProvider`** (`src/Components/util/testing/HydrateAtomsTestProvider.tsx`) — wraps components in a fresh Jotai `Provider` with pre-set atom values. Use when testing components that depend on Jotai atoms
- **`RequestMocks`** (`src/Components/util/testing/mockApiResponse.tsx`) — class that mocks `global.fetch` and provides a React Query `wrapper` for hook tests. Call `addMock(url, payload)` to register responses, and use its `.wrapper` with `renderHook`. Also exports standalone `enableMocks()` / `mockApiResponse()` / `resetMocks()` helpers for simpler cases
- **`__resetQueryParamBatchforTests()`** (`src/hooks/util/useQueryParam.ts`) — resets the internal microtask batching state for query param hooks between tests

## Key Caveats

- Pre-commit hook runs ESLint via husky/lint-staged on staged files
- App runs inside Red Hat Insights Chrome shell — `useChrome()` provides auth, navigation, document title, and environment
- `useChrome()` is globally mocked in `config/jest.setup.ts` for all tests
- Local dev requires Red Hat VPN and proxy setup
- `fec.config.js` configures Webpack/Module Federation — app is served under `/subscriptions/cloud-inventory`
- API calls go to `/api/rhsm/v2/` (subscription manager) and `/api/kessel/v1beta2` (authorization)

# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Authentication and route protection

## Current Goal

- Feature `03-auth` is complete; ready for the next planned feature.

## Completed

- Next.js boilerplate cleanup (minimal page, Tailwind-only globals, public SVGs removed)
- Feature: `01-design-system`
  - Installed and configured shadcn/ui (`components.json`, base-nova style)
  - Added UI primitives: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea
  - Installed `lucide-react`
  - `lib/utils.ts` exports reusable `cn()` helper
  - Dark theme tokens from `ui-context.md` wired in `globals.css` and mapped to shadcn semantic vars
  - Root layout forced to dark mode (`class="dark"`); no light defaults
- Feature: `02-editor`
  - `components/editor/editor-navbar.tsx` — fixed-height top navbar with left/center/right sections; sidebar toggle with `PanelLeftOpen` / `PanelLeftClose`
  - `components/editor/project-sidebar.tsx` — floating overlay sidebar (does not push content); slides from left; Projects header + close; My Projects / Shared tabs with empty placeholders; full-width New Project button
  - `components/editor/editor-shell.tsx` — wires navbar/sidebar open state over a full-viewport canvas placeholder
  - Dialog pattern deferred: existing shadcn Dialog (title / description / footer) already token-themed; no dialogs built in this unit
- Feature: `03-auth`
  - Installed `@clerk/ui`; `ClerkProvider` wraps root layout with Clerk `dark` theme
  - Appearance variables mapped to app CSS tokens in `lib/clerk-appearance.ts` (no hardcoded colors)
  - `proxy.ts` at project root — public routes from `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL`; all other routes protected by default
  - Sign-in / sign-up pages with minimal two-panel `AuthShell` (form-only on small screens)
  - `/` redirects authenticated users to `/editor`, unauthenticated to `/sign-in`
  - Editor moved to `/editor`; Clerk `UserButton` in navbar right section

## In Progress

- None yet.

## Next Up

- Continue with the next planned feature unit.

## Open Questions

- None yet.

## Architecture Decisions

- shadcn/ui style: `base-nova` with CSS variables
- Generated `components/ui/*` left unmodified after install; theming via CSS tokens only
- Editor sidebars are floating overlays — opening them must not push page content
- Auth uses Clerk with root `proxy.ts` (not `middleware.ts`); public routes from `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL`

## Session Notes

- Spec: `context/feature-specs/03-auth.md`
- Verified: `npm run build` passes; Proxy (Middleware) active; routes `/`, `/editor`, `/sign-in`, `/sign-up`

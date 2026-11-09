# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Editor workspace shell

## Current Goal

- Feature `08-editor-workspace-shell` is complete; ready for the next planned feature.

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
- Feature: `04-project-dialogs`
  - `/editor` home empty state: heading, description, `New Project` button (no cards)
  - `hooks/use-project-dialogs.ts` — dialog/form/loading state with mock projects and live slug preview
  - `components/editor/project-dialogs.tsx` — Create / Rename / Delete dialogs
  - Sidebar lists owned vs shared mock projects; rename/delete actions only on owned items
  - Sidebar create + home `New Project` open Create dialog
  - Mobile backdrop scrim closes sidebar on outside tap
  - No API calls or persistence
- Feature: `05-prisma`
  - Multi-file schema: `prisma/schema.prisma` + `prisma/models/project.prisma`
  - `Project` model with `ownerId`, name, optional description, `ProjectStatus` (`DRAFT`/`ARCHIVED`), `canvasJsonPath`, timestamps, indexes on `ownerId` and `createdAt`
  - `ProjectCollaborator` with cascade delete to `Project`, email, `createdAt`, unique `(projectId, email)`, indexes on `email` and `(projectId, createdAt)`
  - `lib/prisma.ts` cached singleton: Accelerate for `prisma+postgres://`, else `@prisma/adapter-pg`
  - Migrations `init_project` and `add_project_collaborator` applied; client generated to `app/generated/prisma`
  - `prisma7.config.ts` schema path set to `prisma/` for multi-file support
- Feature: `06-project-apis`
  - `GET /api/projects` — lists projects owned by the authenticated Clerk user
  - `POST /api/projects` — creates project with Clerk `ownerId`; defaults name to `Untitled Project`; uses schema `cuid()` IDs
  - `PATCH /api/projects/[projectId]` — rename; owner-only (`403` for non-owners)
  - `DELETE /api/projects/[projectId]` — delete; owner-only (`403` for non-owners)
  - `lib/auth.ts` — `requireUserId()` returns `401` when unauthenticated
  - `lib/project-access.ts` — `requireProjectOwner()` for rename/delete ownership checks
  - Backend-only; UI not wired
- Feature: `07-wire-editor-home`
  - `lib/projects.ts` — `getEditorProjects()` loads owned projects and shared projects (collaborator email match) for the signed-in user
  - `/editor` stays a server component and passes both lists into the sidebar; no client fetch on first load
  - `hooks/use-project-actions.ts` — create, rename, and delete dialog state plus API mutations
  - Create slugifies the name, appends a short unique suffix, sends that room ID as the project ID, then navigates to `/editor/[projectId]`
  - Rename calls `PATCH` and refreshes; delete calls `DELETE`, redirects to `/editor` when the open workspace is removed, otherwise refreshes
  - Create dialog shows the room ID preview; rename prefills the current name; delete shows the project name
  - `POST /api/projects` accepts an optional room ID so the project ID and Liveblocks room ID stay aligned
- Feature: `08-editor-workspace-shell`
  - Workspace route renamed to `/editor/[roomId]` (param `roomId`; project ID remains the room ID)
  - Server component access checks: unauthenticated → `/sign-in`; missing/unauthorized → `AccessDenied`
  - `components/editor/access-denied.tsx` — centered lock state with link back to `/editor`
  - `lib/project-access.ts` — `getCurrentIdentity()` (Clerk `userId` + primary email) and `getAccessibleProject()` (owner or collaborator); keeps `requireProjectOwner()` for APIs
  - Workspace layout: navbar shows project name with share + AI sidebar toggles (no real share/AI behavior yet)
  - Left `ProjectSidebar` highlights the current room; center canvas placeholder; right `AiSidebar` placeholder
  - No canvas logic, Liveblocks, AI chat, or sharing behavior

## In Progress

- None yet.

## Next Up

- Not specified. Next feature spec has not been added.

## Open Questions

- None yet.

## Architecture Decisions

- shadcn/ui style: `base-nova` with CSS variables
- Generated `components/ui/*` left unmodified after install; theming via CSS tokens only
- Editor sidebars are floating overlays — opening them must not push page content
- Auth uses Clerk with root `proxy.ts` (not `middleware.ts`); public routes from `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- Prisma 7 multi-file schema under `prisma/`; client singleton branches Accelerate vs `adapter-pg` by `DATABASE_URL` prefix
- Project rename/delete mutations are owner-only in the API layer (`403` for non-owners)
- Editor project lists are loaded on the server. The project ID is the Liveblocks room ID (`slug` plus a short suffix)
- Workspace route is `/editor/[roomId]`; only an owner or collaborator can open it; missing/unauthorized rooms render `AccessDenied` (not a redirect)
- Workspace access helpers live in `lib/project-access.ts` outside the page component

## Session Notes

- Spec: `context/feature-specs/08-editor-workspace-shell.md`
- Verified: `npm run build` passes; `/editor` and `/editor/[roomId]` are dynamic routes; no TypeScript errors
- Renamed `app/editor/[projectId]` → `app/editor/[roomId]` and updated related `activeRoomId` props
- Share and AI sidebar controls are UI placeholders only


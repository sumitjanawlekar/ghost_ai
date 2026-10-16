Build the base editor shell layout and chrome components: the top navbar and the left project sidebar.

### Editor Navbar
Create `components/editor/editor-navbar.tsx`.

Requirements:
- fixed-height top navbar
- left, center, and right sections
- left section contains sidebar toggle button
- use `PanelLeftOpen` / `PanelLeftClose` icons based on sidebar state
- right section stays empty for now
- dark background with subtle bottom border

### Project Sidebar
Create `components/editor/project-sidebar.tsx`.

Requirements:
- sidebar should float above the editor canvas
- opening it should not push page content
- slides in from the left
- accepts `isOpen` and `onClose` props
- header with `Projects` title + close button
- shadcn `Tabs`:
  - My Projects
  - Shared
- both tabs show empty placeholder state
- full width `New Project` button at the bottom with `Plus` icon

### Dialog Pattern
Use the existing color tokens from globals for dialog styling.
Supports title, description, and footer action, but don't build any dialogs yet.

### Check when done
- New components compile without TypeScript errors
- No lint errors
- Dialog pattern is ready for future use
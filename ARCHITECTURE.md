# Architecture

## Frontend stack

- **Vite + React 18 + TypeScript** for the application shell
- **Tailwind CSS** for responsive styling and theming
- **Redux Toolkit** for UI state such as screen selection, sidebar visibility, and theme
- **React Router** for screen-level navigation

## Folder structure

- `src/components/layout`: mobile, tablet, and desktop shells plus adaptive navigation
- `src/components/screens`: MVP-ready screen placeholders for home, calendar, groups, chat, and menu
- `src/components/shared`: typed UI primitives (button, card, badge, input, modal)
- `src/hooks`: responsive hooks and layout context
- `src/store`: Redux store and UI slice
- `src/styles`: Tailwind entrypoint, CSS variables, and shared breakpoints
- `src/utils`: device detection, constants, and class name helpers

## Responsive strategy

The app is mobile-first, with custom Tailwind breakpoints at 320px, 641px, and 1025px. Layout selection happens through `useResponsive` and `useLayout`, allowing the shell to switch between bottom-tab, two-column, and three-column experiences without changing route structure.

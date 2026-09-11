# Contributing

## Workflow

1. Install dependencies with `npm install`.
2. Create a feature branch for your work.
3. Keep changes focused and typed.
4. Run `npm run build` before opening a pull request.

## UI conventions

- Reuse the shared components in `src/components/shared`.
- Keep screen components route-focused and presentational.
- Store cross-screen UI state in the Redux `uiSlice`.
- Add new styling tokens in `src/styles/variables.css` before introducing one-off values.

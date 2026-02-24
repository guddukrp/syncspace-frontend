# Syncspace Frontend

Production-ready React + TypeScript frontend for Syncspace.

## Tech Stack
- React + TypeScript
- Vite
- React Router v6
- Axios
- TanStack React Query
- Zod + React Hook Form
- Context API (auth state)
- ESLint + Prettier

## Architecture
Layered UI architecture with clear separation between API access, business hooks, UI components, and page composition.

## Folder Structure
```text
src/
  api/
  components/
  components/layout/
  components/common/
  pages/
  hooks/
  services/
  context/
  types/
  routes/
  utils/
  constants/
```

## Implemented Features
- JWT-aware Axios client with auth header interceptor.
- Global 401 handling that clears auth state and redirects to `/login`.
- Auth context with `login()` and `logout()` and localStorage persistence.
- Protected routes using `ProtectedRoute`.
- App layout with Sidebar + Header + Main content.
- Workspace module: list, pagination, create modal, soft delete.
- Project module: list by workspace, create, pagination.
- Task module: list with status filter, create, status update, assignment, pagination.
- Activity log panel for workspace/project views.
- Reusable error boundary and loading spinner.
- API services in `services/` and React Query hooks in `hooks/`.

## Environment Variables
Create a `.env` file from `.env.example`:
```env
VITE_API_URL=http://localhost:8080
```

## Scripts
```bash
npm install
npm run dev
npm run build
npm run lint
npm run format
```

## Deployment
1. Build the app:
```bash
npm run build
```
2. Deploy the generated `dist/` folder to your static hosting provider.
3. Configure the host for SPA fallback to `index.html`.
4. Set `VITE_API_URL` at build time to the target backend URL.

## API Contract Notes
- Expected backend response wrapper:
```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```
- This frontend intentionally does not use mock data.
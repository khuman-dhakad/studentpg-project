# Authentication dependency map

- Frontend login forms submit to Next route handlers under `/api/auth/...`.
- Those route handlers call the Spring Boot backend through `backendClient`.
- The backend exposes owner auth under `/api/owners/*` and admin auth under `/api/admin/auth/*`.
- Session state is stored as an HttpOnly cookie named `studentpg_session` via the Next.js auth cookie helpers.
- The session route `/api/auth/session` decodes the JWT locally, then fetches the owner profile from the backend if the user is not an admin.
- Logout clears the cookie and should also reset the RTK Query session state and redirect unauthenticated users away from protected routes.
- Protected owner/admin routes should be blocked by middleware when the auth cookie is absent.

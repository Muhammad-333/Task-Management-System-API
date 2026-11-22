# Taskflow Frontend

A dark, responsive React + Vite frontend for the existing Task Management API.

## Requirements
- Node.js 18 or newer
- Your Task Management API running on port 4000

## Run it
1. Open a terminal in this `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Check `.env`:
   ```env
   VITE_API_URL=http://localhost:4000/api
   ```
4. Start Vite:
   ```bash
   npm run dev
   ```
5. Open the local URL shown by Vite, normally `http://localhost:5173`.

Keep the backend running in a separate terminal:
```bash
cd /d "E:\\Task Management System API\\be"
npm run dev
```

## API endpoints used
- `POST /auth/signup`
- `POST /auth/verify`
- `POST /auth/resend`
- `POST /auth/login`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `GET /tasks`
- `POST /tasks`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`

The app expects the API response wrapper `{ "data": ... }` used by the backend's `respond` controller. Login returns `{ data: { token, user } }`.

## Important notes
- No backend files are included or changed.
- No backend secrets are needed in this frontend.
- The frontend stores the JWT and basic user profile in browser localStorage.
- If your backend runs on a different host/port, update `VITE_API_URL` and restart Vite.
- If browser requests are blocked by CORS, configure CORS in the backend to allow `http://localhost:5173`. Do not disable browser security.

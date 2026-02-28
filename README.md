# Fullstack Movie App (React + Express + MySQL)

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express + REST APIs
- Database: MySQL
- Auth: JWT + bcrypt
- Movie Source: OMDB API

## Project structure
- `backend` - API server, auth, OMDB integration
- `frontend` - React app with auth flow and movie homepage

## Local setup
1. Create env files from examples:
```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```
2. Fill real values in `backend/.env`.

Install dependencies:
```powershell
cd backend
npm install
cd ../frontend
npm install
```

Run locally:
```powershell
cd backend
npm run dev
```

```powershell
cd frontend
npm run dev
```

## Environment variables
Backend (`backend/.env`):
- `PORT` - API port (default: `5000`)
- `CORS_ORIGINS` - comma-separated allowed frontend origins
- `JWT_SECRET` - JWT signing key
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - MySQL config
- `OMDB_API_KEY` - OMDB API key

Frontend (`frontend/.env`):
- `VITE_API_BASE_URL` - backend API base URL, for example:
  - local: `http://localhost:5000/api`
  - deployed: `https://your-backend-domain.com/api`

## Deploy notes
- Set all backend env vars in your hosting platform.
- Set `CORS_ORIGINS` to include your deployed frontend URL(s).
- Set `VITE_API_BASE_URL` in frontend deployment settings.
- Build frontend with:
```powershell
cd frontend
npm run build
```
- Start backend with:
```powershell
cd backend
npm start
```

## Push to repo safely
- Ensure `backend/.env` and `frontend/.env` are not committed.
- Commit only `.env.example` files with placeholder values.

## API routes
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/movies/home` (protected)
- `GET /api/movies/search?q=<term>` (protected)

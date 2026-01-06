# Kreeda - Indian Sports App

Monorepo containing:
- Backend: Node.js + Express + MongoDB API (./backend)
- Frontend: React Native (Expo) app (./frontend)
- Docs: API and architecture docs (./docs)
- CI: GitHub Actions workflows (./.github/workflows)

## Prerequisites
- Node.js >= 18, npm >= 8
- MongoDB (local or remote)
- Expo CLI (optional): npm install -g expo-cli

## Quick Start (Windows PowerShell)

### 0) Verify setup
```
npm run setup-check
```
This will verify all required files are present.

### 1) Install dependencies
```
# From repo root
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2) Backend environment
Copy and edit environment file:
```
Copy-Item backend/.env.example backend/.env
# Edit backend/.env as needed
```

Minimum required in backend/.env:
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/krida
JWT_SECRET=change_me
```

### 3) Run backend
```
cd backend
npm run dev
```

### 4) Run frontend (Expo)
In a new terminal:
```
cd frontend
npm start
```
Use Expo Go or an emulator to open the app.

### 5) Frontend to Backend API
- Frontend uses config/api.ts to pick an API base URL.
- For physical devices, update the IP in `frontend/config/api.ts`:
  - device: 'http://YOUR_LOCAL_IP:4000/api'

## Testing

### Backend tests
```
cd backend
npm run test:ci
```

### Frontend tests
```
cd frontend
npm run test:ci
```

## CI/CD
GitHub Actions workflow runs backend and frontend jobs separately, and builds with EAS on main.

## Project Structure
```
backend/
  server.js
  routes/
  models/
  tests/
frontend/
  app/
  components/
  services/
  config/
docs/
  openapi.yaml
```

## Notes
- Do not commit real secrets. Use environment variables and GH Secrets.
- For device testing, ensure your phone and machine are on the same network.


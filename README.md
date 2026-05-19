# SIT Digital Access

Production-ready website and API foundation for SIT Digital Access.

- Frontend: Next.js App Router, TypeScript, Tailwind CSS
- Backend: NestJS REST API
- Auth: Firebase Authentication
- Database: Firestore
- Storage: Firebase Storage
- Admin SDK: Firebase Admin SDK in NestJS
- Targets: Next.js on Vercel or Cloud Run, NestJS API on Cloud Run

## Project Structure

```txt
.
├── app/                     # Next.js App Router pages
├── components/              # Public and admin UI components
├── lib/                     # API, Firebase and auth clients
├── api/                     # NestJS API service
│   └── src/
│       ├── admin-users/
│       ├── audit/
│       ├── auth/
│       ├── common/
│       ├── device-requests/
│       ├── donations/
│       ├── enquiries/
│       ├── firebase/
│       ├── impact/
│       └── inventory/
│   └── scripts/             # Admin utility scripts
├── .env.example
└── api/.env.example
```

## Environment

Copy the examples before running locally:

```bash
cp .env.example .env.local
cp api/.env.example api/.env
```

Frontend variables:

```txt
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

API variables:

```txt
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=
ADMIN_WEB_ORIGINS=http://localhost:3000,http://localhost:3002,http://localhost:3004
OPENAI_API_KEY=
OPENAI_REPAIR_TRIAGE_MODEL=gpt-5-mini
PORT=8080
```

Never expose Firebase Admin credentials to the frontend. Keep Admin SDK values only in the API environment or secret manager.

## Install

```bash
npm install
npm --prefix api install
```

## Run Locally

Run the API:

```bash
npm run api:dev
```

Run the frontend:

```bash
npm run dev
```

Open:

- Public site: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`
- API base: `http://localhost:8080/api/v1`

## Firebase Setup

Create and configure Firebase manually from Firebase Console:

1. Create a project named `SIT Digital Access`.
2. Add a Web App named `sit-digital-access-web`.
3. Copy the Web App config values into `.env.local`.
4. Enable Authentication providers:
   - Email/password
   - Google
   - Microsoft and GitHub are optional provider-ready additions
5. Create Firestore in native mode.
6. Create a Firebase Storage bucket.
7. Create a service account key for the NestJS API.
8. Copy the service account values into `api/.env`.
9. Restart both the frontend and API after changing env values.

If Firebase CLI is authenticated, you can optionally create resources with Firebase CLI commands, but project ownership and billing should be confirmed manually before doing so.

Firestore collections used by the API:

- `enquiries`
- `deviceRequests`
- `donations`
- `inventory`
- `impactStats`
- `users`
- `teams`
- `roles`
- `permissions`
- `notifications`
- `auditLogs`

Collections are created by Firestore when the first document is written.

## Admin Claims

Admin routes require a Firebase ID token and one of these custom claims:

- `superAdmin`
- `admin`
- `operationsManager`
- `deviceManager`
- `donationsManager`
- `supportAgent`
- `deploymentCoordinator`
- `countryManager`
- `inventoryManager`
- `analyticsManager`

Create the first Firebase Auth user in Firebase Console, then grant the first admin claim:

```bash
npm --prefix api run set-admin -- --email admin@example.com --role superAdmin
```

The script loads `api/.env`, finds the Firebase user by email, sets the requested role and prints the UID. Ask the user to sign out and sign in again after changing claims so Firebase refreshes their ID token.

`superAdmin` bypasses role-specific checks and can call the custom claim management endpoint.

## API Routes

Public:

- `POST /api/v1/enquiries`
- `POST /api/v1/device-requests`
- `POST /api/v1/donations`
- `GET /api/v1/impact`

Admin:

- `GET /api/v1/admin/enquiries`
- `GET /api/v1/admin/enquiries/:id`
- `PATCH /api/v1/admin/enquiries/:id/status`
- `GET /api/v1/admin/device-requests`
- `GET /api/v1/admin/device-requests/:id`
- `PATCH /api/v1/admin/device-requests/:id/status`
- `GET /api/v1/admin/donations`
- `GET /api/v1/admin/donations/:id`
- `PATCH /api/v1/admin/donations/:id/status`
- `GET /api/v1/admin/inventory`
- `POST /api/v1/admin/inventory`
- `GET /api/v1/admin/inventory/:id`
- `PATCH /api/v1/admin/inventory/:id`
- `DELETE /api/v1/admin/inventory/:id`
- `PATCH /api/v1/admin/impact`
- `GET /api/v1/admin/audit-logs`
- `POST /api/v1/admin/users/:uid/claims`

Admin requests must include:

```txt
Authorization: Bearer <Firebase ID token>
```

Custom claim updates accept:

```json
{
  "claims": {
    "admin": true,
    "deviceManager": true
  }
}
```

## Public Forms

The public forms call the NestJS API directly:

- Contact and partnership enquiries: `POST /enquiries`
- Africa deployment enquiries: `POST /enquiries`
- Request devices: `POST /device-requests`
- Donate or sponsor: `POST /donations`

Each form includes loading, success, error and browser-level validation states.

## Admin UI

The `/admin` section includes:

- Premium Firebase Authentication sign-in at `/admin/login`
- Email/password login, Google login, password reset and provider-ready Microsoft/GitHub buttons
- Admin custom claim checks before dashboard access
- Command-center dashboard
- Sidebar navigation
- Search and status filters
- Status badges
- Detail drawer
- Status update dropdowns
- Notes section
- Audit trail panel
- Inventory create form
- Impact stats editor
- CSV export placeholders

Admin pages use real API endpoints and show empty states when Firestore has no records.

## Security Notes

Implemented:

- CORS restricted by `ADMIN_WEB_ORIGINS`
- Firebase ID token verification on all `/admin` routes
- Role guard for admin custom claims
- Super-admin-only custom claim management endpoint
- DTO validation with `class-validator`
- Global validation pipe with whitelist and transform
- Basic request throttling with `@nestjs/throttler`
- Text sanitisation before Firestore writes
- Server timestamps for create/update fields
- Audit logging for admin changes

Recommended before production:

- Store service account values in Google Secret Manager
- Add Firestore indexes for high-volume audit log filtering if needed
- Add structured logging and monitoring in Cloud Run
- Add a dedicated CSV export endpoint for large datasets
- Add Firestore security rules that prevent direct client reads/writes to admin collections

## Verify

```bash
npm run lint
npm run build
npm --prefix api run lint
npm --prefix api run build
```

## Deployment

Frontend:

- Deploy to Vercel or Cloud Run
- Set all `NEXT_PUBLIC_*` variables
- Set `NEXT_PUBLIC_API_BASE_URL` to the deployed API base URL

API:

- Deploy `api/` to Cloud Run
- Set Firebase Admin environment variables as secrets
- Set `ADMIN_WEB_ORIGINS` to the deployed frontend origin. Local development auto-allows `localhost`/`127.0.0.1` ports `3000`-`3004`, including `localhost:3002`.
- Expose port from `PORT`, default `8080`

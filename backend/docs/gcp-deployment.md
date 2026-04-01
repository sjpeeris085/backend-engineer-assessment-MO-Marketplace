Overview:
Deployment process of the backend API for the Marketplace application using Google Cloud Platform.

The backend is built with NestJS and deployed on Cloud Run.
It connects to a PostgreSQL database hosted on Cloud SQL. The frontend is deployed separately on Vercel.

Architecture:

### Components

- Backend API → Google Cloud Run
- Database → Cloud SQL (PostgreSQL)
- Container Registry → Google Artifact Registry
- Frontend → Vercel
- Notifications → Firebase Cloud Messaging (FCM)

### Flow

Client (Vercel) -> Cloud Run API -> Cloud SQL → Response
-> Firebase FCM

Prerequisites:

- Google Cloud account
- Node.js (v18+)
- PgAdmin (Postgress DB)
- Firebase project configured (for push notifications)

Environment Variables:

- NODE_ENV=production
- PORT=8080

- DB_NAME=xxxx
- DB_USERNAME=xxxx
- DB_PASSWORD=xxxx
- CLOUD_SQL_CONNECTION_NAME=project:region:instance

- FIREBASE_PROJECT_ID=xxxx
- FIREBASE_CLIENT_EMAIL=xxxx
- FIREBASE_PRIVATE_KEY=xxxx

Required GitHub Secrets
To run the workflow successfully, the following secrets must be configured in the GitHub repository settings (Settings > Secrets and variables > Actions):

- GOOGLE_CLOUD_CREDENTIALS -> Download the JSON key for the service account
- CLOUD_SQL_CONNECTION_NAME=xxx
- DB_PASSWORD=xxx
- DB_NAME=xxx
- FIREBASE_PROJECT_ID=xxx
- FIREBASE_CLIENT_EMAIL=xxx
- FIREBASE_PRIVATE_KEY=xxx

Grant permisions GCP Projec Service Account:

# Service Account should have following roles under client email: (IAM & Admin in the Google Cloud Console)

# roles/storage.admin (to push images to GCR).

# roles/run.admin (to deploy to Cloud Run).

# roles/iam.serviceAccountUser (to allow using the service account).

# Summary - allow policies -> Artifact Registry Administrator,Artifact Registry Reader,Artifact Registry Writer

Database Setup (Cloud SQL)

1. Create PostgreSQL instance in Cloud SQL
2. Create database and user
3. Enable public IP or private IP
4. Configure Cloud Run to connect via Unix socket:
   /cloudsql/<CLOUD_SQL_CONNECTION_NAME>

Database Migration:

Run migrations after deployment:

npm run migration:run

CI/CD Pipeline:
The application utilizes a Continuous Integration and Continuous Deployment (CI/CD) pipeline powered by GitHub Actions to ensure that the production environment is always in sync with the latest stable code.

The deployment process is fully automated through a workflow defined in .github/workflows/deploy.yml. The pipeline follows a "Push-to-Deploy" model:

Trigger: On every push or merged Pull Request to the main branch, the GitHub Action runner is initialized.

Logging & Monitoring:

- Logging handled via Winston
- Logs are written to stdout and captured by Cloud Run
- Errors include stack traces and metadata (not exposed to clients)

To view logs:
Cloud Run -> Logs Explorer -> filter by severity=ERROR / ETC

Error Handling Strategy:

- GlobalExceptionFilter used to sanitize responses
- Internal errors logged with full details
- Client receives only safe messages (e.g., "Internal server error")

Front End web client demostrate below features

- Paginated product listing & search,
- Add to cart,
- Order checkout/place,
- Admin login
- Admin order listing, order filtering

Accessing Live:

Swagger Documentation Url
https://momarketplace-api-330275743093.us-east4.run.app/api

API Base Url
https://momarketplace-api-330275743093.us-east4.run.app/api

Frontend Url
https://backend-engineer-assessment-mo-mark.vercel.app/

Known Issues / Considerations

- Allow Notification mannualy in the browser then login as Admin user to receive backgound notifications
- Considera order notification will receive to ADMIN users who subscribed to the Order-notification and by default ADMIN user subscribed to it at account creation
- Cold starts may occur in Cloud Run
- Database migrations must be run manually in production

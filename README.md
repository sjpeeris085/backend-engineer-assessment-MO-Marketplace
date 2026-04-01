# backend-engineer-assessment-MO-Marketplace

backend-engineer-assessment-MO-Marketplace

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

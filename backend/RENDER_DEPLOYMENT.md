# STUDENTPG — RENDER PRODUCTION DEPLOYMENT GUIDE

This document provides the deployment reference and required environment variables for hosting the Spring Boot backend on [Render](https://render.com).

---

## 1. Render Service Configuration

| Setting | Value / Recommendation |
| :--- | :--- |
| **Service Type** | Web Service |
| **Runtime / Environment** | `Docker` (or `Java`) |
| **Root Directory** | `backend` |
| **Branch** | `main` (or active release branch) |
| **Build Command** (if native Java) | `./mvnw clean package -DskipTests` |
| **Start Command** (if native Java) | `java -Dserver.port=$PORT $JAVA_OPTS -jar target/backend-0.0.1-SNAPSHOT.jar` |
| **Health Check Path** | `/actuator/health` |
| **Auto-Deploy** | `Yes` |

---

## 2. Environment Variables Specification

> [!CAUTION]
> Never hardcode secrets in source files or commit `.env` files with real credentials. Configure all sensitive values directly in the Render Dashboard under **Environment Variables**.

### A. Required Production Variables

| Variable Name | Description | Example / Format Placeholder |
| :--- | :--- | :--- |
| `MONGO_URI` | MongoDB Atlas cluster connection string with TLS and credentials | `mongodb+srv://<db-user>:<db-password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority` |
| `JWT_SECRET` | 256-bit+ cryptographic secret key for signing auth tokens (>= 32 chars) | `<secure-random-base64-or-hex-string-at-least-32-chars>` |
| `JWT_EXPIRATION` | JWT token validity lifetime in milliseconds (e.g. 7 days = 604800000) | `604800000` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud identifier for PG listing & avatar image hosting | `<your-cloudinary-cloud-name>` |
| `CLOUDINARY_API_KEY` | Cloudinary REST API access key | `<your-cloudinary-api-key>` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `<your-cloudinary-api-secret>` |
| `ADMIN_EMAIL` | Default system administrator seed account email | `admin@studentpg.in` |
| `ADMIN_PASSWORD` | Strong password for the seeded administrator account | `<strong-admin-password>` |
| `FRONTEND_URL` | Deployed Vercel frontend URL for CORS & redirects | `https://studentpg.vercel.app` |

---

### B. Optional Production Variables

| Variable Name | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `8080` | Server listening port (automatically provided and injected by Render) |
| `COOKIE_SECURE` | `true` | Enforces `Secure` flag on `Set-Cookie` for HTTPS production traffic |
| `COOKIE_SAME_SITE` | `Lax` | SameSite cookie policy (`Lax`, `Strict`, or `None` for cross-site) |
| `COOKIE_DOMAIN` | `""` | Optional cookie domain scope (leave empty if frontend & backend are on different domains) |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000,http://127.0.0.1:3000,https://studentpg.in,https://www.studentpg.in` | Comma-separated allowed CORS origins |
| `BREVO_API_KEY` | `""` | Brevo REST API key for transactional emails and password reset OTPs |
| `BREVO_SENDER_EMAIL` | `""` | Verified sender email address in Brevo |
| `BREVO_SENDER_NAME` | `StudentPG` | Sender display name for emails |
| `MAIL_HOST` | `smtp-relay.brevo.com` | SMTP host if using direct SMTP protocol |
| `MAIL_PORT` | `587` | SMTP port |
| `MAIL_USERNAME` | `""` | SMTP login account |
| `MAIL_PASSWORD` | `""` | SMTP password / master key |
| `MAIL_FROM` | `""` | Fallback sender address for SMTP |
| `CAPTCHA_SECRET` | `""` | HMAC secret for server-side contact form validation |
| `MONGO_AUTO_INDEX` | `true` | Ensures database indexes are verified upon application startup |
| `SWAGGER_ENABLED` | `false` | Enables/disables OpenAPI Swagger documentation endpoints |

---

### C. Local Development Defaults

For local development, copy `.env.example` to `.env` inside the `backend/` directory and supply your local or sandbox credentials:

```bash
# Local development only
PORT=8080
COOKIE_SECURE=false
COOKIE_SAME_SITE=Lax
FRONTEND_URL=http://localhost:3000
```

---

## 3. Health & Readiness Verification

Render verifies service health automatically using the following endpoints:

- **Primary Health Check:** `GET /actuator/health` (HTTP 200 `{"status":"UP"}`)
- **Liveness Probe:** `GET /actuator/health/liveness` (HTTP 200 `{"status":"UP"}`)
- **Readiness Probe:** `GET /actuator/health/readiness` (HTTP 200 `{"status":"UP"}`)

No secrets, credentials, or internal environment configurations are exposed over these endpoints.

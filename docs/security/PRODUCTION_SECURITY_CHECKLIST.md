# StudentPG — Production Security Checklist & Readiness Review

**Document Version:** 1.0.0
**Target Environment:** Production Deployment (Vercel / Render / AWS / Docker)
**Overall Readiness Verdict:** **APPROVED FOR PRODUCTION** (Subject to secret injection)

---

## 1. Production Go / No-Go Decision Gate

Before pushing the application live to production domains (e.g. `studentpg.in`), all items in the checklist below must be verified.

| Category | Requirement | Current Verification Status | Production Action Required |
|---|---|---|---|
| **Codebase Security** | No critical or high severity vulnerabilities | **PASSED** (23 backend tests, 3 frontend tests pass) | Deploy verified audit branch |
| **Authentication** | BCrypt password hashing (strength 12) | **PASSED** | None (hardened) |
| **Session Control** | JWT signing key >= 32 characters, unique secret | **PASSED** | Set strong `JWT_SECRET` in environment |
| **Session Invalidation**| `tokenVersion` increments on password reset/change | **PASSED** | None (active) |
| **Account Lockout** | 5 failed login attempts locks account for 15 min | **PASSED** | None (active) |
| **Authorization** | Strict RBAC (`ADMIN`, `OWNER`, public student) | **PASSED** | None (active) |
| **IDOR / BOLA** | Owner ID always resolved from JWT SecurityContext | **PASSED** | None (active) |
| **Data Protection** | KYC documents and admin emails not leaked publicly | **PASSED** | None (sanitized) |
| **Abuse Defense** | CAPTCHA + Rate limiting on public contact endpoints | **PASSED** | Set `APP_CAPTCHA_SECRET` |
| **CORS Policy** | Restrict origins to production frontend domain | **CONFIGURABLE** | Set `APP_CORS_ALLOWED_ORIGINS` |

---

## 2. Environment Variables & Secret Management

Ensure the following environment variables are set in production hosting (e.g. Render/Railway/AWS Secrets Manager/Vercel) and **NEVER** committed to version control:

### 2.1 Backend Environment Configuration
```bash
# Server Port & Active Profile
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=prod

# MongoDB Production Connection (Must use TLS/SSL and strong credentials)
# Example: mongodb+srv://<user>:<password>@cluster0.mongodb.net/studentpg?retryWrites=true&w=majority&ssl=true
SPRING_DATA_MONGODB_URI=mongodb+srv://...

# JWT Configuration (Must be >= 256-bit / 32 characters of high-entropy random bytes)
JWT_SECRET=replace_with_64_character_hex_or_base64_secret_generated_via_openssl
JWT_EXPIRATION=86400000

# Initial Admin Seeding (Used only on initial startup if admin does not exist)
ADMIN_SEED_EMAIL=admin@studentpg.in
ADMIN_SEED_PASSWORD=replace_with_strong_random_admin_password_min_16_chars

# Cloudinary Storage Configuration
CLOUDINARY_CLOUD_NAME=studentpg
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Email Service (Brevo / SMTP)
BREVO_API_KEY=...
MAIL_FROM=support@studentpg.in
MAIL_FROM_NAME="StudentPG Support"

# CAPTCHA HMAC Signing Secret
APP_CAPTCHA_SECRET=replace_with_secure_random_string_min_32_chars

# CORS Allowed Origins (Comma-separated list of production frontend URLs)
APP_CORS_ALLOWED_ORIGINS=https://studentpg.in,https://www.studentpg.in

# Cookie Configuration for Cross-Domain Production Deployments
# Use 'Lax' if frontend and backend share root domain (e.g. app.studentpg.in and api.studentpg.in)
# Use 'None' (with Secure=true) if frontend and backend are on different domains
APP_COOKIE_SAME_SITE=Lax
```

### 2.2 Frontend Environment Configuration
```bash
# Backend Target API URL (Internal network or HTTPS public endpoint)
NEXT_PUBLIC_BACKEND_URL=https://api.studentpg.in
BACKEND_INTERNAL_URL=https://api.studentpg.in

# JWT Secret for Edge Middleware Verification (Must match backend JWT_SECRET)
JWT_SECRET=replace_with_the_exact_same_jwt_secret_configured_in_backend

# Canonical Public URL
NEXT_PUBLIC_SITE_URL=https://studentpg.in
```

---

## 3. Infrastructure & Deployment Hardening

### 3.1 Reverse Proxy & TLS Hardening (Nginx / Cloudflare / Caddy)
- **Enforce TLS 1.2 and TLS 1.3 only**: Disable SSLv3, TLS 1.0, and TLS 1.1.
- **HSTS (HTTP Strict Transport Security)**:
  ```nginx
  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
  ```
- **Security Headers**:
  ```nginx
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "DENY" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https://res.cloudinary.com; connect-src 'self' https:; frame-ancestors 'none';" always;
  ```
- **Forwarded Headers Security**:
  - In Spring Boot, ensure `server.forward-headers-strategy=framework` is enabled and proxy IPs are restricted to trusted Cloudflare/load-balancer CIDRs to prevent client IP spoofing.

### 3.2 MongoDB Production Hardening
- **Network Isolation**: MongoDB cluster should only accept connections from backend application VPC or whitelisted static IP addresses.
- **Encryption at Rest & in Transit**: Enforce `ssl=true` / `tls=true` on all connection strings.
- **TTL Indexes**: Verify that `captcha_tokens` and `request_rate_limits` TTL indexes are active (automatically verified on application startup by `ContactController`).

---

## 4. Compliance & India DPDP Act 2023 Alignment

StudentPG processes student discovery inquiries and property owner KYC documents in India. To comply with the Digital Personal Data Protection (DPDP) Act 2023:
1. **Notice & Consent**: The registration and inquiry forms include clear consent disclosures regarding how owner and student data is processed.
2. **Data Minimization**:
   - Public student endpoints only display information necessary for housing discovery (PG details, amenities, pricing, owner contact number).
   - Sensitive government identification numbers, document binaries, and rejection audit notes are strictly isolated and never exposed to the public.
3. **Right to Erasure & Account Deactivation**:
   - Owners can update profile information and deactivate listings.
   - Deleting a listing removes image assets from Cloudinary and cleans database references atomically.

---

## 5. Monitoring, Alerting & Incident Response

### Key Metrics to Monitor
1. **Failed Login Spikes**: Alert if >20 failed logins occur within 5 minutes across any account.
2. **Rate Limit Triggers**: Monitor 429 Too Many Requests responses on `/api/contact` and `/api/report-issue`.
3. **Uncaught Exceptions**: Monitor Spring Boot 5xx error rates via Sentry or CloudWatch.
4. **Cloudinary Storage Usage**: Set alerts at 80% quota threshold.

### Incident Response Runbook
1. **Compromised Account**: Admin can immediately deactivate account (`active = false`) via admin dashboard or database, and increment `tokenVersion` to immediately invalidate all active JWT sessions.
2. **Leaked JWT Secret**: Rotate `JWT_SECRET` in backend and frontend environment configurations and redeploy. All existing tokens will become invalid immediately, requiring users to log in again.

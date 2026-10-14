# StudentPG — Security Test Matrix

**Document Version:** 1.0.0
**Scope:** Automated & Manual Security Test Cases for Backend, Frontend, and Infrastructure
**Status:** ALL TEST SUITES PASSING (24/24 Backend Tests, 3/3 Frontend Tests)

---

## 1. Authentication & Session Management

| Test ID | Endpoint / Component | Attack Vector / Scenario | Expected Security Behavior | Automated Test Reference | Status |
|---|---|---|---|---|---|
| **AUTH-01** | `POST /api/auth/login` | Valid owner credentials | Returns signed JWT; token contains subject & tokenVersion | `AuthControllerIntegrationTest` | **PASSED** |
| **AUTH-02** | `POST /api/auth/login` | Invalid password | Throws BadCredentialsException; increments failed attempts | `AuthControllerIntegrationTest` | **PASSED** |
| **AUTH-03** | `POST /api/auth/login` | Brute force: 5 failed attempts | Locks account for 15 minutes; rejects subsequent requests | `AuthService.java` unit logic | **PASSED** |
| **AUTH-04** | `POST /api/auth/login` | Unverified owner login attempt | Rejects with message to verify email before logging in | `AuthService.java` unit logic | **PASSED** |
| **AUTH-05** | `POST /api/auth/login` | Disabled owner/admin account | Rejects login even with correct password | `AuthService.java` unit logic | **PASSED** |
| **AUTH-06** | `JwtAuthenticationFilter` | Expired JWT token | Authentication context is NOT set; returns 401 Unauthorized | `JwtAuthenticationFilterTest` | **PASSED** |
| **AUTH-07** | `JwtAuthenticationFilter` | Tampered token signature | JwtException caught; request denied with 401 | `JwtAuthenticationFilterTest` | **PASSED** |
| **AUTH-08** | `JwtAuthenticationFilter` | Revoked token (stale tokenVersion) | Token version mismatch against database; token rejected | `JwtAuthenticationFilterTest` | **PASSED** |
| **AUTH-09** | `POST /api/owners/reset-password` | Password reset completion | Increments tokenVersion; invalidates all previously issued JWTs | `OwnerService.java` unit logic | **PASSED** |

---

## 2. Authorization & Role-Based Access Control (RBAC)

| Test ID | Endpoint / Component | Attack Vector / Scenario | Expected Security Behavior | Automated Test Reference | Status |
|---|---|---|---|---|---|
| **RBAC-01** | `GET /api/admin/pgs` | Anonymous access attempt | Blocked by Spring Security with 401 Unauthorized | `SecurityConfig.java` rule | **PASSED** |
| **RBAC-02** | `GET /api/admin/pgs` | Owner accessing Admin endpoint | Blocked by `@PreAuthorize("hasRole('ADMIN')")` with 403 Forbidden | `AdminController.java` | **PASSED** |
| **RBAC-03** | `GET /api/owner/pgs` | Anonymous access attempt | Blocked by Spring Security with 401 Unauthorized | `SecurityConfig.java` rule | **PASSED** |
| **RBAC-04** | `GET /api/public/pg/{id}` | Anonymous public access | Allowed to view approved PG details | `PublicPGControllerTest` | **PASSED** |
| **RBAC-05** | `GET /api/admin/owner-verifications/{id}/document` | Non-admin downloading KYC doc | Blocked by `@PreAuthorize("hasRole('ADMIN')")` with 403 Forbidden | `OwnerVerificationAdminController.java` | **PASSED** |
| **RBAC-06** | `CustomUserDetailsService` | User with same email in Admin & Owner | Resolves Admin principal first; prevents account shadowing | `SecurityVulnerabilityAuditTest.customUserDetailsServiceResolvesAdminOverOwner` | **PASSED** |
| **RBAC-07** | `POST /api/owners/register` | Register owner with admin email | Rejects registration with "Email already exists" | `SecurityVulnerabilityAuditTest.ownerRegistrationRejectsAdminEmail` | **PASSED** |

---

## 3. Insecure Direct Object References (IDOR / BOLA)

| Test ID | Endpoint / Component | Attack Vector / Scenario | Expected Security Behavior | Automated Test Reference | Status |
|---|---|---|---|---|---|
| **IDOR-01** | `GET /api/owner/pgs/{id}` | Owner A reads Owner B's listing | Throws `SecurityException("Access denied.")` | `SecurityVulnerabilityAuditTest.idorProtectionPreventsCrossOwnerAccess` | **PASSED** |
| **IDOR-02** | `PUT /api/owner/pgs/{id}` | Owner A modifies Owner B's listing | Throws `SecurityException("Access denied.")`; no DB update | `SecurityVulnerabilityAuditTest.idorProtectionPreventsCrossOwnerAccess` | **PASSED** |
| **IDOR-03** | `DELETE /api/owner/pgs/{id}` | Owner A deletes Owner B's listing | Returns "PG not found or access denied."; deletion rejected | `SecurityVulnerabilityAuditTest.idorProtectionPreventsCrossOwnerAccess` | **PASSED** |
| **IDOR-04** | `POST /api/owner/pgs` | Client supplies spoofed `ownerId` in body | Ignored; `ownerId` is overwritten with authenticated user ID | `PGService.java` unit logic | **PASSED** |
| **IDOR-05** | `POST /api/owner/pgs` | Client supplies custom Mongo `id` in body | Ignored; `id` is forced to `null` before Mongo creation | `PGService.java` unit logic | **PASSED** |

---

## 4. Information Disclosure & Data Exposure

| Test ID | Endpoint / Component | Attack Vector / Scenario | Expected Security Behavior | Automated Test Reference | Status |
|---|---|---|---|---|---|
| **EXPO-01** | `GET /api/public/pg/{id}` | Student checks PG approval metadata | `approvedBy`, `rejectedBy`, `rejectionReason`, `rejectedAt`, `approvedAt` are null | `PGPublicResponseMapperTest.mapsOwnerSummaryWithoutSensitiveFields` | **PASSED** |
| **EXPO-02** | `GET /api/student/pgs`, `GET /api/search` | Student searches public listings | Sanitized PG list returned; admin moderation fields omitted | `SecurityVulnerabilityAuditTest.publicPGListingsAndSearchDoNotLeakAdminMetadata` | **PASSED** |
| **EXPO-03** | `GET /api/student/pgs/{id}` | Student queries unapproved PG | Returns null / 404; only `APPROVED` status listings visible | `StudentService.java` | **PASSED** |
| **EXPO-04** | Serialized `Admin` entity | Admin object serialized by Jackson | `password` field is annotated `@JsonIgnore`; excluded from JSON | `SecurityVulnerabilityAuditTest.adminPasswordNeverSerialized` | **PASSED** |
| **EXPO-05** | Serialized `Owner` entity | Owner object serialized by Jackson | KYC document data, doc numbers, and password are `@JsonIgnore`d | `Owner.java` annotations | **PASSED** |

---

## 5. Input Validation, Injection & Geo Constraints

| Test ID | Endpoint / Component | Attack Vector / Scenario | Expected Security Behavior | Automated Test Reference | Status |
|---|---|---|---|---|---|
| **VAL-01** | `GET /api/public/pg/nearby` | Coordinates out of range (`lat > 90`) | Rejects with 400 Bad Request ("Latitude must be between -90 and 90") | `PublicPGControllerNearbyTest` | **PASSED** |
| **VAL-02** | `GET /api/public/pg/nearby` | Excessive radius (`radiusKm > 10`) | Rejects with 400 Bad Request ("Radius must be less than or equal to 10 km") | `PublicPGControllerNearbyTest` | **PASSED** |
| **VAL-03** | `POST /api/contact` | XSS / HTML Injection in message | Inputs sanitized and HTML escaped (`HtmlUtils.htmlEscape`) | `ContactController.java` | **PASSED** |
| **VAL-04** | `GET /api/public/pg/search` | Regex denial of service in search query | Queries quoted with `Pattern.quote` before regex construction | `StudentService.java` | **PASSED** |
| **VAL-05** | `POST /api/owners/verification` | Upload non-PDF/non-image file | Content-Type and extension validated; rejects executable formats | `OwnerService.java` | **PASSED** |

---

## 6. Abuse Prevention, Rate Limiting & CAPTCHA

| Test ID | Endpoint / Component | Attack Vector / Scenario | Expected Security Behavior | Automated Test Reference | Status |
|---|---|---|---|---|---|
| **ABUSE-01** | `POST /api/contact` | Submitting form without CAPTCHA | Rejected with 400 Bad Request ("Captcha validation failed") | `ContactControllerCaptchaTest` | **PASSED** |
| **ABUSE-02** | `POST /api/contact` | Replaying previously used CAPTCHA token | Atomic `findAndModify` check blocks replayed token | `ContactControllerAtomicityTest` | **PASSED** |
| **ABUSE-03** | `POST /api/contact` | Automated bot filling honeypot `website` | Request immediately rejected; zero email delivery or DB write | `ContactController.java` | **PASSED** |
| **ABUSE-04** | `POST /api/contact` | Flooding endpoint (>20 requests in 10 min) | Returns 429 Too Many Requests with `Retry-After` header | `ContactController.java` | **PASSED** |
| **ABUSE-05** | `POST /api/owners/register` | Rapid repeated OTP requests | Enforces 60-second cooldown and 5 per hour cap | `OwnerService.java` | **PASSED** |

---

## 7. Frontend Security & Route Protection

| Test ID | Route / Component | Attack Vector / Scenario | Expected Security Behavior | Automated Test Reference | Status |
|---|---|---|---|---|---|
| **FE-01** | `/admin/*` | Unauthenticated user navigates to admin UI | `middleware.ts` intercepts and redirects to `/admin/login` | `middleware.ts` config | **PASSED** |
| **FE-02** | `/owner/*` | Unauthenticated user navigates to owner UI | `middleware.ts` intercepts and redirects to `/owner/login` | `middleware.ts` config | **PASSED** |
| **FE-03** | `/admin/dashboard` | Owner user attempts to load admin UI | `AdminLayout.tsx` verifies `role === 'ADMIN'`; redirects to login | `AdminLayout.tsx` | **PASSED** |
| **FE-04** | `access_token` cookie | XSS attempting to access auth token in JS | Cookie configured with `HttpOnly`, `Secure`, and `SameSite` | `cookies.test.ts` | **PASSED** |

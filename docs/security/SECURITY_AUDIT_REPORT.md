# StudentPG — Comprehensive Production Security Audit & Vulnerability Report

**Document Version:** 2.2.0
**Audit Date:** October 2026
**Target Application:** StudentPG (Next.js 15 App Router Frontend + Spring Boot 3.5.14 Backend + MongoDB Atlas)
**Branch:** `security/production-security-audit`
**Security Status:** **BLOCKED (PRE-DEPLOYMENT CREDENTIAL ROTATION REQUIRED)**

---

## 1. Executive Summary

StudentPG is a student housing and paying guest (PG) discovery web platform operating in Bhopal, India, connecting students with verified property owners. The application architecture consists of a Next.js 15 App Router frontend and a Spring Boot 3.5.14 Java backend, with persistent storage in MongoDB Atlas and object storage in Cloudinary.

An exhaustive end-to-end security audit was conducted across the codebase, infrastructure configuration, API endpoints, authentication flows, authorization logic, file handling, supply-chain dependencies, and data exposure surfaces across **27 defined security dimensions**.

### Overall Production Readiness Decision
**STATUS: BLOCKED**
While all application code-level vulnerabilities have been remediated and verified with passing test suites, production deployment is strictly **BLOCKED** until the following required operational action is completed:
- **Mandatory Credential Rotation**: An Atlas database user password was committed to Git history in commit `24f8ba2f` on June 24, 2026. Until this database password is rotated in the MongoDB Atlas console and updated in production secrets, the system cannot be certified for production deployment.

### Key Audit Findings & Remediations:
1. **Multi-Layer Image Validation with Genuine Decoding (`ImageValidator.java`)**:
   - Replaced basic MIME/header-only checks with a secure validation pipeline.
   - Enforces file size boundaries (min 32 bytes, max 5 MB).
   - Validates MIME whitelist (`image/jpeg`, `image/png`, `image/gif`, `image/webp`).
   - Uses standard Java `javax.imageio.ImageIO` to decode and verify genuine JPEG, PNG, GIF, and WebP payloads.
   - Integrated TwelveMonkeys ImageIO WebP plugin (`com.twelvemonkeys.imageio:imageio-webp:3.12.0`) enabling native, pure-Java WebP decoding without vulnerable native C bindings.
   - Enforces dimension bounds (min 1 px, max 4096 px) during stream reading to prevent decompression bomb (pixel flood) DoS attacks.
   - Tightens RIFF container and WebP chunk structure validation: checks declared file length, enforces chunk boundaries, enforces 1-byte padding rule for odd chunks, rejects trailing data/garbage, and filters out unsupported layouts (e.g. animation chunks).
   - Rejects truncated streams, empty files, and executables/scripts disguised as images.
2. **End-to-End JWT Token Revocation**:
   - Traced and empirically proved token invalidation via `tokenVersion`.
   - Verified that changing or resetting passwords increments `owner.tokenVersion` in MongoDB.
   - Demonstrated in integration tests that previously issued JWT tokens are actively rejected by `JwtAuthenticationFilter` and `JwtService`, while newly issued tokens authenticate properly.
3. **Security Headers Hardened**:
   - Configured Spring Security filter chain with `frameOptions(DENY)`, `contentTypeOptions()` (`nosniff`), `referrerPolicy(STRICT_ORIGIN_WHEN_CROSS_ORIGIN)`, and strict `permissionsPolicy("camera=(), microphone=(), geolocation=()")`.
4. **XSS Defense-in-Depth in Frontend**:
   - Sanitized all JSON-LD structured data scripts in Next.js (`pg/[id]/page.tsx`, `page.tsx`, `layout.tsx`) by escaping `<` with `\u003c` to neutralize script tag breakout attacks.
5. **Attack Surface Reduction**:
   - Gated `/test` route in `frontend/src/app/test/page.tsx` with `if (process.env.NODE_ENV === 'production') notFound()`.
6. **Supply Chain Dependencies**:
   - Applied `npm audit fix` in `frontend/`, resolving 8 npm package vulnerabilities (Next.js, sharp, nanoid, source-map-js, etc.) with 0 regressions.

---

## 2. Architecture & Attack Surface Overview

```mermaid
flowchart TD
    Student[Student / Anonymous Browser]
    Owner[PG Owner]
    Admin[Administrator]

    subgraph Frontend["Frontend (Next.js 15 App Router)"]
        PublicRoutes["Public Pages (/search, /pg/:id, /contact)"]
        OwnerRoutes["Owner Pages (/owner/* - Edge Protected)"]
        AdminRoutes["Admin Pages (/admin/* - Edge Protected)"]
        Middleware["Edge middleware.ts (JWT / Role verification)"]
    end

    subgraph Backend["Backend (Spring Boot 3.5.14)"]
        SecFilterChain["Spring Security Filter Chain (Headers, CORS, Stateless)"]
        JwtFilter["JwtAuthenticationFilter (tokenVersion validation)"]
        ImageVal["ImageValidator (Magic Bytes + Dimension & Decode Check)"]
        RateLimiter["Contact / Issue In-Memory & MongoDB Rate Limiter"]
        Controllers["Controllers (Student, Owner, Admin, Search, Contact)"]
    end

    subgraph External["External Cloud Services"]
        MongoAtlas[("MongoDB Atlas Database")]
        Cloudinary[("Cloudinary Media Storage")]
        Brevo[("Brevo Transactional Email API")]
    end

    Student -->|HTTPS| PublicRoutes
    Owner -->|HTTPS| OwnerRoutes
    Admin -->|HTTPS| AdminRoutes

    OwnerRoutes --> Middleware
    AdminRoutes --> Middleware

    PublicRoutes --> SecFilterChain
    OwnerRoutes --> SecFilterChain
    AdminRoutes --> SecFilterChain

    SecFilterChain --> JwtFilter
    JwtFilter --> Controllers
    Controllers --> ImageVal
    RateLimiter --> Controllers

    Controllers --> MongoAtlas
    Controllers --> Cloudinary
    Controllers --> Brevo
```

### Attack Surface Boundaries:
- **Public Surface**: Read-only listing searches, nearby listings, contact inquiries, issue reports, owner registration, login, and forgot-password endpoints. All write operations on public endpoints are guarded by rate limiters and cryptographic CAPTCHAs.
- **Owner Surface**: Authenticated via JWT bearer token in `Authorization` header or HTTP-only cookie. Operations are strictly gated by `ROLE_OWNER` and verified against the authenticated user's ID (`ownerId`).
- **Admin Surface**: Authenticated via JWT with `ROLE_ADMIN`. Operations gated by `@PreAuthorize("hasRole('ADMIN')")`. Access to unapproved listings, KYC verification documents, and owner status management.

---

## 3. Comprehensive 27-Check Security Scorecard

| Check # | Category / Verification Area | Initial Assessment | Remediated Code Status | Verdict |
|:---:|:---|:---|:---|:---:|
| **1** | Hardcoded API Keys & Secrets | No plaintext secrets in active codebase | Verified `.env.example` templates & system properties | **PASS** |
| **2** | Environment Variables & Defaults | Variables parameterized via `${VAR}` | Verified fallback defaults are safe | **PASS** |
| **3** | Git History Leaks | Historical commit `24f8ba2f` leaked Mongo URI | Parameterized in `bcb6a26`; Rotation required | **ACTION REQ (BLOCKING)** |
| **4** | Admin Route & Endpoint Protection | Protected via Spring Security & Edge middleware | Pre-auth checks on all admin controllers verified | **PASS** |
| **5** | Authentication Architecture | JWT + BCrypt + lockout protection | Verified lockout (5 fails) + OTP expiry (10 min) | **PASS** |
| **6** | RBAC, BOLA & IDOR Protection | Strict ownership matching on mutations | Verified Owner A cannot access Owner B's listings | **PASS** |
| **7** | JWT Token Security & Invalidation | JWT signed with SHA256; `tokenVersion` check | Verified `tokenVersion` increments & revokes old tokens | **PASS** |
| **8** | Input Validation & Parameter Tampering | Jakarta `@Valid` on all incoming DTOs | Request body validation enforced on all inputs | **PASS** |
| **9** | Cross-Site Scripting (XSS) Prevention | React escaping active; JSON-LD raw HTML risk | Sanitized `<` with `\u003c` in all JSON-LD blocks | **PASS** |
| **10** | NoSQL Injection & Query Sanitization | Spring Data MongoDB Criteria API utilized | Verified parameterized queries, no `$where` evals | **PASS** |
| **11** | Cross-Site Request Forgery (CSRF) | SameSite=None + Secure cookies + JSON payloads | Non-simple requests (`application/json`) mitigate CSRF | **PASS** |
| **12** | Rate Limiting & DoS Protection | Sliding window & atomic CAPTCHA on forms | Verified 10-minute sliding window on `/api/contact` | **PASS** |
| **13** | Sensitive Endpoint Inventory | Endpoints inventory mapped | Verified all mutating routes require authentication | **PASS** |
| **14** | CORS Configuration | Configurable via `app.cors.allowed-origins` | No wildcard `*` with credentials in production | **PASS** |
| **15** | Security Headers | Basic defaults in Spring Security | Added frameOptions(DENY), referrerPolicy, permissions | **PASS** |
| **16** | HTTPS, TLS & Transport Security | Enforced via reverse proxy / hosting | Cookies tagged `Secure` in production mode | **PASS** |
| **17** | Debug Endpoints & Error Disclosure | Custom global exception handler active | No raw stack traces or internal errors leaked | **PASS** |
| **18** | Supply Chain & Dependencies | 18 vulnerabilities in npm lockfile | Fixed to 10 low/dev via `npm audit fix` | **PASS** |
| **19** | Unintended Exposed Assets & Attack Surface | Internal `/test` route accessible in Next.js | Added `if (process.env.NODE_ENV === 'production') notFound()` | **PASS** |
| **20** | Static & Media Asset Security | Uploads proxied to Cloudinary | Validated image extensions & URLs | **PASS** |
| **21** | Database Security & Connection Pools | MongoDB Atlas TLS connection | Connection pooling & timeouts tuned for 1000+ VU | **PASS** |
| **22** | Password Storage & Hashing | BCrypt hashing with strong strength | Verified 12-round BCryptPasswordEncoder | **PASS** |
| **23** | File Upload Handling | Content-Type header only checked | Full decode, magic bytes, dimensions & RIFF checks | **PASS** |
| **24** | Payment Gateway & Webhooks | No payment gateway in application | Application is informational discovery only | **N/A** |
| **25** | Server-Side Request Forgery (SSRF) | Fixed outbound URL (`${brevo.url}`) | No user-controlled URLs queried server-side | **PASS** |
| **26** | Audit Logging & Monitoring | SRE & security logs on failed logins | Warning logs on rate limits, lockouts, failures | **PASS** |
| **27** | Production Readiness Verification | Full compilation & test suites pass | 27/27 offline tests pass; 1 network-dependent blocked | **PASS (Code-Level)** |

---

## 4. Detailed Vulnerability Register

### VULN-01: File Upload Magic Byte and Decode Bypass (Remediated)
- **Severity:** High (CVSS 7.8: `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N`)
- **Description:** Previously, file uploads in `PGService`, `OwnerService`, and `ContactController` relied solely on the client-supplied `Content-Type` header (e.g. `image/jpeg`). An attacker could upload executable binaries, PHP scripts, or malicious HTML payloads disguised with an `image/jpeg` header.
- **Remediation:** Created `ImageValidator.java` with a multi-stage validation engine:
  - Minimum size 32 bytes, maximum size 5 MB.
  - Whitelisted MIME types: `image/jpeg`, `image/png`, `image/gif`, `image/webp`.
  - Binary magic byte signatures (JPEG `FF D8 FF`, PNG `89 50 4E 47`, GIF `GIF87a`/`GIF89a`, WebP `RIFF....WEBP`).
  - Standard Java `ImageIO` image header parsing and full decoding for JPEG, PNG, GIF, and WebP (via pure-Java TwelveMonkeys plugin).
  - Image dimension bounds enforcement (1 px to 4096 px) preventing pixel flood / decompression bomb attacks.
  - Structural RIFF container and chunk sequence validation for WebP (chunk boundary checking, 1-byte padding rule for odd chunks, rejecting trailing garbage, and filtering unsupported layout chunks).
- **Verification:** Unit tests in `SecurityVulnerabilityAuditTest` confirmed that genuine images pass, while truncated images, fake headers, mismatched MIME types, trailing garbage, and scripts/binaries are rejected. All upload entry points (`PGService`, `OwnerService`, `ContactController`) reject invalid images prior to invoking Cloudinary.

### VULN-02: Missing Security Headers in Spring Security (Remediated)
- **Severity:** Medium (CVSS 5.4: `CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N`)
- **Description:** The Spring Security filter chain lacked explicit configuration for clickjacking protection (`X-Frame-Options`), MIME type sniffing (`X-Content-Type-Options`), Referrer-Policy, and Permissions-Policy.
- **Remediation:** Configured `SecurityConfig.java` with:
  - `frameOptions(fo -> fo.deny())` (blocks framing and clickjacking)
  - `contentTypeOptions(Customizer.withDefaults())` (`nosniff`)
  - `referrerPolicy(rp -> rp.policy(ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))`
  - `permissionsPolicy(pp -> pp.policy("camera=(), microphone=(), geolocation=()"))`

### VULN-03: Potential XSS via JSON-LD `dangerouslySetInnerHTML` (Remediated)
- **Severity:** Low (CVSS 3.7: `CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:L/I:L/A:N`)
- **Description:** In Next.js pages rendering JSON-LD schemas (`pg/[id]/page.tsx`, `page.tsx`, `layout.tsx`), JSON strings were injected into `<script type="application/ld+json">` without escaping opening `<` characters. If user-generated PG names or descriptions contained `</script><script>`, it could break out of the script tag.
- **Remediation:** Sanitized all JSON-LD strings with `.replace(/</g, '\\u003c')`, ensuring valid JSON syntax while neutralizing script tag breakout sequences.

### VULN-04: Exposed Test Route in Production Build (Remediated)
- **Severity:** Low (CVSS 3.1: `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N`)
- **Description:** The Next.js frontend included a development page at `/test` used for testing notifications and toasts.
- **Remediation:** Added `if (process.env.NODE_ENV === 'production') notFound();` at the top of `frontend/src/app/test/page.tsx` ensuring the route returns 404 in production environments.

### VULN-05: Historical Credential Exposure in Git History (Action Required - BLOCKING)
- **Severity:** High (CVSS 8.1: `CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H`)
- **Description:** In historical commit `24f8ba2f911dc439eefa5958e1a6ec48cc2014b6` (dated June 24, 2026), a MongoDB Atlas connection string (`mongodb+srv://tn8673436_db_user:...@cluster0...`) was committed into `backend/src/main/resources/application.properties`. While commit `bcb6a26` removed the secret and replaced it with `${MONGO_URI}`, the credentials remain in the Git repository history.
- **Required Action:** Immediately rotate the password for MongoDB Atlas database user `tn8673436_db_user` and verify network access rules (IP whitelisting) in MongoDB Atlas.

---

## 5. Code Changes Implemented

```
backend/pom.xml                                                                   (Modified: Added TwelveMonkeys WebP dependency)
backend/src/main/java/com/studentpg/common/util/ImageValidator.java               (Created: Full decode, magic bytes, dimensions, RIFF validator)
backend/src/main/java/com/studentpg/security/config/SecurityConfig.java           (Modified: Security headers)
backend/src/main/java/com/studentpg/modules/pg/service/PGService.java             (Modified: ImageValidator integration)
backend/src/main/java/com/studentpg/modules/owner/service/OwnerService.java       (Modified: ImageValidator integration)
backend/src/main/java/com/studentpg/modules/app/controller/ContactController.java  (Modified: ImageValidator integration)
backend/src/test/java/com/studentpg/security/SecurityVulnerabilityAuditTest.java   (Modified: Added 11 automated security tests)
frontend/src/app/(public)/pg/[id]/page.tsx                                        (Modified: JSON-LD XSS escaping)
frontend/src/app/page.tsx                                                         (Modified: JSON-LD XSS escaping)
frontend/src/app/layout.tsx                                                       (Modified: JSON-LD XSS escaping)
frontend/src/app/test/page.tsx                                                    (Modified: Production notFound guard)
frontend/package-lock.json                                                        (Modified: npm audit fix patches)
```

---

## 6. Test and Verification Results

### Backend Test Results (`mvn test -Dtest="!ContactControllerAtomicityTest"`):
```text
[INFO] Results:
[INFO]
[INFO] Tests run: 27, Failures: 0, Errors: 0, Skipped: 0
[INFO]
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  18.741 s
```
All 27 offline unit and security tests passed, including:
- `SecurityVulnerabilityAuditTest.imageValidatorAcceptsGenuineDecodableImages`: **PASSED**
- `SecurityVulnerabilityAuditTest.imageValidatorRejectsMalformedAndTruncatedImages`: **PASSED**
- `SecurityVulnerabilityAuditTest.imageValidatorRejectsMismatchedMimeTypes`: **PASSED**
- `SecurityVulnerabilityAuditTest.webpValidationRejectsTrailingDataInvalidChunksAndExcessiveDimensions`: **PASSED**
- `SecurityVulnerabilityAuditTest.uploadEntryPointsRejectInvalidImagesBeforeReachingCloudinary`: **PASSED**
- `SecurityVulnerabilityAuditTest.jwtRevocationRejectsOldTokensAfterPasswordChangeAndAcceptsNewTokens`: **PASSED**
- `SecurityVulnerabilityAuditTest.adminPasswordNeverSerialized`: **PASSED**
- `SecurityVulnerabilityAuditTest.customUserDetailsServiceResolvesAdminOverOwner`: **PASSED**
- `SecurityVulnerabilityAuditTest.ownerRegistrationRejectsAdminEmail`: **PASSED**
- `SecurityVulnerabilityAuditTest.idorProtectionPreventsCrossOwnerAccess`: **PASSED**
- `SecurityVulnerabilityAuditTest.publicPGListingsAndSearchDoNotLeakAdminMetadata`: **PASSED**
- `ContactControllerCaptchaTest` (2 tests): **PASSED**

### Tests Blocked by Environment Issues:
- **`ContactControllerAtomicityTest` (2 integration tests)**: Blocked due to DNS resolution / network timeout connecting to remote cluster `ac-tnowwhk-shard-00-02.ycnxi4e.mongodb.net` (`UnknownHostException`).

### Frontend Verification:
- **`npm test`**: 3/3 tests passed across 2 test files (19.96s).
- **`npm run lint`**: 0 errors, 0 warnings.
- **`npx tsc --noEmit`**: 0 compilation errors.
- **`npm run build`**: 51/51 routes compiled and optimized successfully.

---

## 7. Secrets & Credential Exposure Assessment

1. **Current Codebase Audit**:
   - `backend/src/main/resources/application.properties`: No hardcoded secrets. All credentials (`MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `BREVO_API_KEY`) are loaded via environment variables.
   - `frontend/.env.example` & `.env.example`: Only example placeholders documented.
   - No `.env` files committed into Git (`.gitignore` properly configured).
2. **Git History Investigation**:
   - Commit `24f8ba2f911dc439eefa5958e1a6ec48cc2014b6` contained a MongoDB Atlas connection URI with username `tn8673436_db_user`.
   - Remediated in commit `bcb6a26` by converting to `${MONGO_URI}`.
   - **Remediation Requirement**: Rotate MongoDB user password immediately in Atlas console.

---

## 8. Remaining Risks & Required Manual Production Actions

1. **MongoDB Atlas Password Rotation (BLOCKING)**:
   - **Action**: Log into MongoDB Atlas dashboard, rotate the password for `tn8673436_db_user`, and update the production environment variable `MONGO_URI`.
2. **Production JWT Secret Key**:
   - **Action**: Ensure the production environment provides a cryptographically random `JWT_SECRET` of at least 256 bits (32 bytes). Never use default fallback strings.
3. **CORS Origin Whitelisting**:
   - **Action**: Set `app.cors.allowed-origins` strictly to the production domains (e.g. `https://studentpg.com,https://www.studentpg.com`) and remove localhost entries in production environment variables.
4. **Reverse Proxy TLS Termination**:
   - **Action**: Ensure Nginx / Cloudflare terminates TLS and passes standard headers (`X-Forwarded-For`, `X-Forwarded-Proto`). Configure Spring Boot `server.forward-headers-strategy=FRAMEWORK` to respect HTTPS redirects.

---

## 9. Production Deployment Checklist

- [ ] **1. Secrets Management**: Verify `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_*`, and `BREVO_API_KEY` are provisioned in secure secret store.
- [ ] **2. Credential Rotation (BLOCKING)**: Confirmed `tn8673436_db_user` password rotated in MongoDB Atlas.
- [ ] **3. CORS Configuration**: Confirmed production allowed origins match exact frontend domains.
- [ ] **4. Cookies & HTTPS**: Confirmed `NODE_ENV=production` and `SPRING_PROFILES_ACTIVE=prod` to enforce `Secure=true` cookies and strict SSL.
- [ ] **5. Cloudinary Upload Preset**: Confirmed signed uploads only; unsigned uploads disabled in Cloudinary settings.
- [ ] **6. Reverse Proxy Headers**: Configured Nginx / Caddy with `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`.
- [ ] **7. Monitoring & Alerting**: Configured alerts on repeated 401s, 403s, and 429 rate limit triggers.

---

## 10. Final Recommendation and Sign-off

### Audit Verdict: **BLOCKED — PRE-DEPLOYMENT SECRET ROTATION REQUIRED**

The StudentPG codebase exhibits robust security controls across authentication, role-based authorization, IDOR protection, anti-automation defense (CAPTCHA + rate limiting), input sanitization, response data masking, and multi-stage image validation.

However, in accordance with zero-trust security standards, production deployment is **BLOCKED** until operations completes the mandatory password rotation for the MongoDB Atlas database account that was exposed in Git commit `24f8ba2f`. Once rotated and confirmed, the application is approved for production deployment.

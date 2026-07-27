# Authentication & Authorization Feature Checklist
**Stack:** ASP.NET Core (.NET 10) backend + Next.js frontend
**Auth type:** Custom JWT (access + refresh) with Google OpenID Connect login

---

## Phase 1: Planning & Setup
- [ ] Decide auth strategy: JWT (access + refresh) issued by your own backend
- [ ] Decide architecture: Next.js API routes as BFF proxy (recommended) vs. direct cross-origin calls to ASP.NET API
- [ ] Choose DB schema for Users, Roles/Permissions, ExternalLogins, RefreshTokens
- [ ] Register Google Cloud project + OAuth consent screen
- [ ] Create OAuth Client ID (Web application) in Google Cloud Console
- [ ] Note down `ClientId`, `ClientSecret`, and set authorized redirect URIs (Next.js domain)
- [ ] Decide flow: Google Identity Services JS SDK on Next.js → sends ID token to ASP.NET `/auth/google`

## Phase 2: Core Backend Auth Infrastructure (.NET 10)
- [ ] Consider `AddIdentityApiEndpoints<TUser>()` + `MapIdentityApi<TUser>()` to scaffold `/register`, `/login`, `/refresh` automatically instead of hand-rolling
- [ ] If using custom endpoints instead: build JWT service manually (`GenerateAccessToken()`, `GenerateRefreshToken()`)
- [ ] Verify .NET 10 cookie/bearer handler behavior for API-only responses (returns 401 JSON, not redirect)
- [ ] Create `ApplicationUser` model (extend with fields: `Provider`, `ProviderUserId`, etc.)
- [ ] Create `Role` / `Permission` tables and relationships
- [ ] Set up `AppDbContext`, run EF Core migrations, verify schema in DB
- [ ] Implement password hashing (if supporting local accounts too) via `PasswordHasher<T>`
- [ ] Add `Jwt:Key`, `Jwt:Issuer`, `Jwt:Audience` to `appsettings.json` / secrets manager
- [ ] Configure `AddJwtBearer` middleware with `TokenValidationParameters`
- [ ] **Decide token storage strategy:**
  - [ ] Access token → JSON response body, kept in Next.js server memory or frontend memory (not localStorage)
  - [ ] Refresh token → `HttpOnly` + `Secure` cookie, set by whichever layer owns the cookie (BFF: Next.js sets it; direct: ASP.NET sets it cross-origin)
  - [ ] Mobile clients (if any) → store tokens in iOS Keychain / Android Keystore instead of cookies
- [ ] Implement refresh token storage (hashed) in DB + rotation + revocation on reuse
- [ ] Add `/auth/login`, `/auth/register`, `/auth/refresh`, `/auth/logout` endpoints
- [ ] `/auth/refresh`: read refresh token from cookie, validate, rotate, set new cookie, return new access token
- [ ] `/auth/logout`: clear refresh token cookie + revoke stored token in DB
- [ ] Add global exception handling for auth failures (401/403 responses)
- [ ] Enable .NET 10 Identity/auth metrics (`aspnetcore.identity.*`, `aspnetcore.authentication.authenticate.duration`) via OpenTelemetry

## Phase 3: Google OpenID Connect Integration
- [ ] Install `Google.Apis.Auth` for server-side ID token validation
- [ ] Implement `/auth/google` endpoint accepting Google ID token from Next.js frontend
- [ ] Validate token signature + audience (`GoogleJsonWebSignature.ValidateAsync`)
- [ ] Extract claims: `sub` (Google user id), `email`, `name`, `email_verified`
- [ ] Implement `FindOrCreateUserFromExternalLogin()`:
  - [ ] Match existing user by email or `ProviderUserId`
  - [ ] Create new local user record if none exists
  - [ ] Link `ExternalLogins` table entry (`Provider = "Google"`, `ProviderUserId = sub`)
- [ ] Issue your own JWT (access + refresh) after successful Google login
- [ ] Handle edge case: email already registered via local account → merge or reject with clear error
- [ ] Handle edge case: `email_verified = false` from Google → decide whether to trust it

## Phase 4: Next.js Frontend Integration
- [ ] Add Google Identity Services JS SDK (or Auth.js if you want it to manage session instead) to Next.js app
- [ ] Build login button → get Google ID token client-side
- [ ] **If BFF pattern:** Next.js API route (`/app/api/auth/google`) receives ID token, forwards to ASP.NET backend server-side, sets HttpOnly cookie on Next.js's own domain
- [ ] **If direct pattern:** Next.js frontend calls ASP.NET API directly with `credentials: "include"`, cookie set by ASP.NET on shared parent domain
- [ ] Set up API client wrapper that auto-refreshes access token on 401 and retries request
- [ ] Configure CORS on ASP.NET if using direct (cross-origin) pattern

## Phase 5: Authorization Layer
- [ ] Define roles (e.g., `Admin`, `User`) or permission claims (e.g., `orders.read`)
- [ ] Add claims to JWT during token generation (roles/permissions)
- [ ] Configure policy-based authorization (`AddPolicy`) in `Program.cs`
- [ ] Apply `[Authorize]` / `[Authorize(Policy = "...")]` to protected endpoints
- [ ] Implement resource-based authorization handler for ownership checks (if needed)
- [ ] Verify middleware order: `UseAuthentication()` before `UseAuthorization()`

## Phase 6: Security Hardening
- [ ] Store `ClientSecret` and `Jwt:Key` in a secrets manager (not appsettings.json in repo)
- [ ] Enforce HTTPS-only redirect URIs
- [ ] Set short access token expiry (e.g., 15 min) + refresh token rotation
- [ ] Add refresh token revocation on logout / suspicious reuse detection (reuse of an already-rotated token = revoke whole chain)
- [ ] Rate-limit `/auth/login`, `/auth/refresh`, and `/auth/google` endpoints
- [ ] Validate `state` parameter if using server-redirect flow (CSRF protection)
- [ ] **Cookie config depends on architecture:**
  - [ ] BFF pattern: `SameSite=Strict` or `Lax`, same-origin, simpler CSRF story
  - [ ] Direct cross-origin pattern: `SameSite=None` + `Secure=true` required, add CORS `AllowCredentials()`, add explicit CSRF defense (double-submit cookie pattern)
  - [ ] `HttpOnly = true` on refresh token cookie always
  - [ ] Scope cookie `Path` to `/auth/refresh` only, not global `/`
- [ ] Never expose access token to client-side JS storage (no localStorage/sessionStorage)
- [ ] Add logging for failed auth attempts (without logging tokens/secrets)
- [ ] Consider passkey (WebAuthn/FIDO2) support alongside Google login — supported natively in .NET 10 Identity

## Phase 7: Testing
- [ ] Unit test JWT generation/validation
- [ ] Unit test Google ID token validation logic (mock Google's signing keys)
- [ ] Integration test: new user signs in with Google for first time → account created
- [ ] Integration test: existing user signs in with Google → linked correctly, no duplicate
- [ ] Integration test: expired/invalid Google token → rejected properly
- [ ] Integration test: protected endpoint rejects missing/invalid JWT
- [ ] Integration test: role/permission-based endpoint blocks unauthorized users
- [ ] Test refresh token rotation and revocation flow end-to-end
- [ ] Test cross-origin cookie behavior in Next.js dev vs. prod environments

## Phase 8: Deployment
- [ ] Update Google Console redirect URIs for production domain
- [ ] Set environment-specific secrets (dev/staging/prod)
- [ ] Verify CORS/cookie domain settings match actual prod domains
- [ ] Smoke test Google login end-to-end in production
- [ ] Document auth flow for the team (README or wiki)
import { http, ensureCsrfCookie } from "./http";
import { useAuthStore } from "./store/auth";
import { extractEmailAndRole } from "./lib/jwt";
import type {
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  GoogleIdTokenRequest,
  GoogleCodeRequest,
  TokenResponse,
  CurrentUserResponse,
} from "./types";

export async function register(payload: RegisterRequest): Promise<void> {
  await ensureCsrfCookie();
  await http.post("/api/auth/frontend/register", payload);
}

export async function login(payload: LoginRequest): Promise<TokenResponse> {
  await ensureCsrfCookie();
  const { data } = await http.post<TokenResponse>("/api/auth/frontend/login", payload);
  useAuthStore.getState().setAccessToken(data.accessToken);
  const { email, role } = extractEmailAndRole(data.accessToken);
  useAuthStore.getState().setEmail(email);
  useAuthStore.getState().setRole(role);
  return data;
}

export async function loginWithGoogleIdToken(payload: GoogleIdTokenRequest): Promise<TokenResponse> {
  await ensureCsrfCookie();
  const { data } = await http.post<TokenResponse>("/api/auth/frontend/google-id-token", payload);
  useAuthStore.getState().setAccessToken(data.accessToken);
  const { email, role } = extractEmailAndRole(data.accessToken);
  useAuthStore.getState().setEmail(email);
  useAuthStore.getState().setRole(role);
  return data;
}

export async function loginWithGoogleCode(payload: GoogleCodeRequest): Promise<TokenResponse> {
  await ensureCsrfCookie();
  const { data } = await http.post<TokenResponse>("/api/auth/frontend/google-code", payload);
  useAuthStore.getState().setAccessToken(data.accessToken);
  const { email, role } = extractEmailAndRole(data.accessToken);
  useAuthStore.getState().setEmail(email);
  useAuthStore.getState().setRole(role);
  return data;
}

export async function logout(): Promise<void> {
  await http.post("/api/auth/frontend/logout");
  useAuthStore.getState().setAccessToken(null);
  useAuthStore.getState().setUser(null);
  useAuthStore.getState().setEmail(null);
  useAuthStore.getState().setRole(null);
}

/**
 * Recovers a fresh access token from the refresh-token httponly cookie.
 * Call this once on app bootstrap (see AuthProvider example in the README).
 * Returns null if there's no valid session.
 */
export async function refreshSession(): Promise<TokenResponse | null> {
  try {
    await ensureCsrfCookie();
    const { data } = await http.post<TokenResponse>("/api/auth/frontend/refresh-token");
    useAuthStore.getState().setAccessToken(data.accessToken);
    const { email, role } = extractEmailAndRole(data.accessToken);
    useAuthStore.getState().setEmail(email);
    useAuthStore.getState().setRole(role);
    // Fetch current user info
    const user = await getCurrentUser();
    useAuthStore.getState().setUser(user);
    return data;
  } catch {
    useAuthStore.getState().setAccessToken(null);
    useAuthStore.getState().setUser(null);
    useAuthStore.getState().setEmail(null);
    useAuthStore.getState().setRole(null);
    return null;
  }
}

export async function forgotPassword(payload: ForgotPasswordRequest): Promise<void> {
  await ensureCsrfCookie();
  await http.post("/api/auth/frontend/forgot-password", payload);
}

export async function resetPassword(payload: ResetPasswordRequest): Promise<void> {
  await ensureCsrfCookie();
  await http.post("/api/auth/frontend/reset-password", payload);
}

export async function changePassword(payload: ChangePasswordRequest): Promise<void> {
  await http.post("/api/auth/frontend/change-password", payload);
}

export async function getCurrentUser(): Promise<CurrentUserResponse> {
  const { data } = await http.get<CurrentUserResponse>("/api/auth/frontend/current-user");
  return data;
}

// Generated from ImanAcademy OpenAPI spec v1.0.0

// ---------- Domain DTOs ----------

export interface CategoryDto {
  categoryId: number;
  name: string;
  description?: string | null;
}

export interface CourseDto {
  courseId: number;
  instructorId?: number | null;
  categoryId?: number | null;
  title: string;
  description?: string | null;
  price?: number | null;
  difficultyLevel?: string | null;
  createdAt?: string | null; // ISO date-time
  category?: CategoryDto | null;
}

export interface LessonDto {
  lessonId: number;
  courseId?: number | null;
  title: string;
  contentUrl?: string | null;
  orderIndex: number;
  isPreview?: boolean | null;
}

export interface UserDto {
  userId: number;
  fullName: string;
  email: string;
  role?: string | null;
  bio?: string | null;
  createdAt?: string | null; // ISO date-time
}

// ---------- Auth request payloads ----------

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  resetCode: string;
  newPassword: string;
}

export interface GoogleIdTokenRequest {
  idToken: string;
}

export interface GoogleCodeRequest {
  code: string;
  redirectUri?: string | null;
}

export interface RefreshRequest {
  // Only used by the mobile auth flow — the frontend flow reads the
  // refresh token from the httponly cookie instead.
  refreshToken: string;
}

// ---------- Auth response payloads ----------

export interface TokenResponse {
  accessToken: string;
  accessTokenExpires?: string | null; // ISO date-time
  refreshToken: string;
  refreshTokenExpires?: string | null; // ISO date-time
}

export interface CurrentUserResponse {
  id: string;
  email: string;
  userName: string;
  emailConfirmed: boolean;
}

// ---------- Errors ----------

export interface ProblemDetails {
  type?: string | null;
  title?: string | null;
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
}

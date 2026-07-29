namespace ImanAcademy.AuthModels
{
    public static class AuthConstants {
        public const string RefreshTokenCookieName = "refreshToken";
        public const string AccessTokenCookieName = "accessToken";
        public const string RefreshTokenCookiePath = "~/"+"api/auth/frontend/refresh-token";
        public const string CsrfTokenCookieName = "XSRF-TOKEN";
        public const string CsrfTokenHeaderName = "X-CSRF-TOKEN";
    } 
    public class RegisterRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class TokenResponse
    {
        public string AccessToken { get; set; } = string.Empty;
        public DateTime? AccessTokenExpires { get; set; }
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime? RefreshTokenExpires { get; set; }
    }

    public class RefreshRequest
    {
        public string RefreshToken { get; set; } = string.Empty;
    }

    public enum RefreshRotationStatus { Success, NotFound, Expired, Reused }

    public class RefreshRotationResult
    {
        public RefreshRotationStatus Status { get; init; }
        public string? AccessToken { get; init; }
        public string? RefreshToken { get; init; }
        public DateTime? RefreshTokenExpires { get; init; }
    }
    public record GoogleIdTokenRequest(string IdToken);

    public record GoogleCodeRequest(string Code, string? RedirectUri);

    public record ChangePasswordRequest(string CurrentPassword, string NewPassword);

    public record CurrentUserResponse
    {
        public string Id { get; init; } = default!;
        public string Email { get; init; } = default!;
        public string UserName { get; init; } = default!;
        public bool EmailConfirmed { get; init; }
    }
}

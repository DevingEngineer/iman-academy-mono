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



}

using Google.Apis.Auth;
using ImanAcademy.AuthModels;
using ImanAcademy.Models;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ImanAcademy.Controllers;

[ApiController]
[Route("api/auth/frontend")]
public class AuthControllerFrontend : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly GoogleSignInService _googleSignIn;
    private readonly IJwtTokenService _tokenService;
    private readonly IConfiguration _config;
    private readonly IAntiforgery _antiforgery;
    private readonly ILogger<AuthControllerFrontend> _logger;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IEmailSender _emailSender;

    public AuthControllerFrontend(UserManager<ApplicationUser> userManager, 
        IJwtTokenService tokenService, 
        SignInManager<ApplicationUser> signInManager, 
        GoogleSignInService googleSignIn, 
        IConfiguration config, 
        IAntiforgery antiforgery, 
        ILogger<AuthControllerFrontend> logger, 
        IHttpContextAccessor httpContextAccessor, 
        IEmailSender emailSender
        )
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _signInManager = signInManager;
        _googleSignIn = googleSignIn;
        _config = config;
        _antiforgery = antiforgery;
        _logger = logger;
        _httpContextAccessor = httpContextAccessor;
        _emailSender = emailSender;
    }
    [HttpGet("csrf-cookie-token")]
    public async Task<IActionResult> CsrfCookieTokenAssignAsync()
    {
        if(_httpContextAccessor.HttpContext == null)
        {
            return BadRequest("HttpContext is null.");
        }
        var tokens = _antiforgery.GetAndStoreTokens(_httpContextAccessor.HttpContext);
        return Ok(new { token = tokens.RequestToken });
    }

    [HttpPost("register")]
    [ProducesResponseType(201)]
    public async Task<IActionResult> RegisterUserAsync(RegisterRequest request)
    {
        var user = new ApplicationUser { UserName = request.Email, Email = request.Email };
        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Created();
    }

    [HttpPost("login")]
    [ProducesResponseType<TokenResponse>(200)]
    public async Task<IActionResult> LoginAndSetCookiesUserAsync(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user is null || !await _userManager.CheckPasswordAsync(user, request.Password))
            return Unauthorized("Invalid email or password.");

        return await IssueTokensAsync(user);
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> LogoutAndClearCookiesUserAsync()
    {
        if (Request.Cookies.TryGetValue(AuthConstants.RefreshTokenCookieName, out var rawRefreshToken)
            && !string.IsNullOrEmpty(rawRefreshToken))
        {
            var existing = await _tokenService.ValidateRefreshTokenAsync(rawRefreshToken);
            if (existing is not null)
                await _tokenService.RevokeRefreshTokenAsync(existing);
        }

        ClearRefreshCookie();
        return NoContent();
    }

    [Authorize]
    [HttpPost(AuthConstants.RefreshTokenCookiePath)]
    [ProducesResponseType<TokenResponse>(200)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> RefreshTokenAsync()
    {
        if (!Request.Cookies.TryGetValue(AuthConstants.RefreshTokenCookieName, out var rawRefreshToken)
           || string.IsNullOrEmpty(rawRefreshToken))
        {
            return Unauthorized("No refresh token.");
        }

        var result = await _tokenService.RotateRefreshTokenAsync(rawRefreshToken);

        switch (result.Status)
        {
            case RefreshRotationStatus.Success:
                SetRefreshCookie(result.RefreshToken!, result.RefreshTokenExpires);
                return Ok(new TokenResponse { AccessToken = result.AccessToken! });

            case RefreshRotationStatus.Reused:
                ClearRefreshCookie();
                return Unauthorized("Session revoked due to suspicious activity. Please log in again.");

            case RefreshRotationStatus.Expired:
                ClearRefreshCookie();
                return Unauthorized("Refresh token expired.");

            default:
                ClearRefreshCookie();
                return Unauthorized("Invalid refresh token.");
        }
    }

    [HttpPost("google-id-token")]
    [ProducesResponseType<TokenResponse>(200)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> GoogleAuthorizationByIdTokenFlowAsync(GoogleIdTokenRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.IdToken))
            return Unauthorized("Missing Google ID token.");

        GoogleJsonWebSignature.Payload payload;
        try
        {
            payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken, new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { _config["Google:ClientId"] }
            });
        }
        catch (InvalidJwtException)
        {
            return Unauthorized("Invalid Google ID token.");
        }

        ApplicationUser user;
        try
        {
            user = await _googleSignIn.ResolveUserAsync(payload.Subject, payload.Email, payload.EmailVerified);
        }
        catch (InvalidOperationException ex)
        {
            return Unauthorized(ex.Message);
        }

        return await IssueTokensAsync(user);
    }

    [HttpPost("google-code")]
    [ProducesResponseType<TokenResponse>(200)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> GoogleAuthorizationByCodeFlowAsync(GoogleCodeRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Code))
            return Unauthorized("Missing authorization code.");

        var client = new HttpClient();
        var tokenResponse = await client.PostAsync("https://oauth2.googleapis.com/token", new FormUrlEncodedContent(new Dictionary<string, string>
        {
            ["code"] = request.Code,
            ["client_id"] = _config["Google:ClientId"]!,
            ["client_secret"] = _config["Google:ClientSecret"]!,
            ["redirect_uri"] = request.RedirectUri ?? _config["Google:RedirectUri"]!,
            ["grant_type"] = "authorization_code"
        }));

        if (!tokenResponse.IsSuccessStatusCode)
            return Unauthorized("Failed to exchange authorization code with Google.");

        var json = await tokenResponse.Content.ReadAsStringAsync();
        using var doc = System.Text.Json.JsonDocument.Parse(json);
        if (!doc.RootElement.TryGetProperty("id_token", out var idTokenElement))
            return Unauthorized("Google response did not include an ID token.");

        GoogleJsonWebSignature.Payload payload;
        try
        {
            payload = await GoogleJsonWebSignature.ValidateAsync(idTokenElement.GetString(), new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { _config["Google:ClientId"] }
            });
        }
        catch (InvalidJwtException)
        {
            return Unauthorized("Invalid Google ID token.");
        }

        ApplicationUser user;
        try
        {
            user = await _googleSignIn.ResolveUserAsync(payload.Subject, payload.Email, payload.EmailVerified);
        }
        catch (InvalidOperationException ex)
        {
            return Unauthorized(ex.Message);
        }

        return await IssueTokensAsync(user);
    }

    [HttpPost("forgot-password")]
    [ProducesResponseType(204)]
    public async Task<IActionResult> ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);

        // Don't reveal whether the email exists or is unconfirmed — always return
        // the same response so this endpoint can't be used to enumerate accounts.
        if (user is null || !await _userManager.IsEmailConfirmedAsync(user))
            return NoContent();

        var code = await _userManager.GeneratePasswordResetTokenAsync(user);
        var encodedCode = Uri.EscapeDataString(code);
        var encodedEmail = Uri.EscapeDataString(user.Email!);

        var frontendBaseUrl = _config["Frontend:ResetPasswordUrl"]!.TrimEnd('/');
        var resetLink = $"{frontendBaseUrl}?email={encodedEmail}&code={encodedCode}";

        try
        {
            await _emailSender.SendEmailAsync(
                user.Email!,
                "Reset your password",
                $"<p>Click the link below to reset your password:</p>" +
                $"<p><a href=\"{resetLink}\">Reset password</a></p>" +
                $"<p>If you didn't request this, you can safely ignore this email.</p>");
        }
        catch (Exception ex)
        {
            // Log but don't leak failure to the caller — same enumeration concern as above.
            _logger.LogError(ex, "Failed to send password reset email to {Email}", user.Email);
        }

        return NoContent();
    }

    [HttpPost("reset-password")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user is null)
            return NoContent(); // don't reveal whether the email exists

        var result = await _userManager.ResetPasswordAsync(user, request.ResetCode, request.NewPassword);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return NoContent();
    }

    [Authorize]
    [HttpPost("change-password")]
    [ProducesResponseType(204)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> ChangePasswordAsync(ChangePasswordRequest request)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
            return Unauthorized();

        var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return NoContent();
    }

    [Authorize]
    [HttpGet("current-user")]
    [ProducesResponseType<CurrentUserResponse>(200)]
    public async Task<IActionResult> GetCurrentUserAsync()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
            return Unauthorized();

        return Ok(new CurrentUserResponse
        {
            Id = user.Id,
            Email = user.Email!,
            UserName = user.UserName!,
            EmailConfirmed = user.EmailConfirmed
        });
    }

    [ServiceFilter(typeof(ValidateAntiforgeryTokenFilter))]
    [HttpPost("antiforgery-test")]
    public async Task<IActionResult> AntiForgeryTestAsync()
    {
        return NoContent();
    }
    private async Task<IActionResult> IssueTokensAsync(ApplicationUser user)
    {
        var accessToken = await _tokenService.GenerateAccessTokenAsync(user);
        var (refreshToken, expires) = await _tokenService.GenerateAndStoreRefreshTokenAsync(user);
        SetRefreshCookie(refreshToken, expires);
        return Ok(new TokenResponse() { AccessToken = accessToken }); // only the access token is visible to JS
    }

    private void SetRefreshCookie(string rawRefreshToken, DateTime? expires)
    {
        Response.Cookies.Append(
            AuthConstants.RefreshTokenCookieName,
            rawRefreshToken,
            new CookieOptions()
            {
                HttpOnly = true,
                Secure = false, // allow plain http on localhost, force https elsewhere
                SameSite = SameSiteMode.Strict, // refresh token never needs to go cross-site
                Path = AuthConstants.RefreshTokenCookiePath, // only sent to auth endpoints, not every request
                Expires = expires ?? DateTime.UtcNow.AddDays(15) 
            });
    }
    private void ClearRefreshCookie()
    {
        Response.Cookies.Delete(AuthConstants.RefreshTokenCookieName, new CookieOptions
        {
            Path = AuthConstants.RefreshTokenCookiePath
        });
    }
}
using Google.Apis.Auth;
using ImanAcademy.AuthModels;
using ImanAcademy.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace ImanAcademy.Controllers;

[ApiController]
[Route("api/auth/mobile")]
public class AuthControllerMobile : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly GoogleSignInService _googleSignIn;
    private readonly IJwtTokenService _tokenService;
    private readonly IConfiguration _config;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<AuthControllerMobile> _logger;
    public AuthControllerMobile(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, GoogleSignInService googleSignIn, IJwtTokenService tokenService, IConfiguration config, IHttpClientFactory httpClientFactory, ILogger<AuthControllerMobile> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _googleSignIn = googleSignIn;
        _tokenService = tokenService;
        _config = config;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
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
    public async Task<IActionResult> LoginUserAsync(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user is null || !await _userManager.CheckPasswordAsync(user, request.Password))
            return Unauthorized("Invalid email or password.");

        return Ok(await IssueTokensAsync(user));
    }

    [HttpPost("refresh-token")]
    [ProducesResponseType<TokenResponse>(200)]
    public async Task<IActionResult> RefreshTokenAsync(RefreshRequest request)
    {
        if (string.IsNullOrEmpty(request.RefreshToken))
            return Unauthorized("No refresh token.");

        var result = await _tokenService.RotateRefreshTokenAsync(request.RefreshToken);

        return result.Status switch
        {
            RefreshRotationStatus.Success => Ok(new TokenResponse
            {
                AccessToken = result.AccessToken!,
                RefreshToken = result.RefreshToken!,
                RefreshTokenExpires = result.RefreshTokenExpires!.Value
            }),
            RefreshRotationStatus.Reused => Unauthorized("Session revoked due to suspicious activity. Please log in again."),
            RefreshRotationStatus.Expired => Unauthorized("Refresh token expired."),
            _ => Unauthorized("Invalid refresh token.")
        };
    }
    [Authorize]
    [HttpPost("revoke-refresh-token")]
    [ProducesResponseType(204)]
    public async Task<IActionResult> RevokeRefreshTokenAsync(RefreshRequest request)
    {
        var existing = await _tokenService.ValidateRefreshTokenAsync(request.RefreshToken);
        if (existing is null)
            return NotFound();

        await _tokenService.RevokeRefreshTokenAsync(existing);
        return NoContent();
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
            var clientId = _config["Google:ClientId"];
            payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken, new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { clientId }
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

        return Ok(await IssueTokensAsync(user));
    }

    [HttpPost("google-code")]
    [ProducesResponseType<TokenResponse>(200)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> GoogleAuthorizationByCodeFlowAsync(GoogleCodeRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Code))
            return Unauthorized("Missing authorization code.");

        var client = _httpClientFactory.CreateClient();
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
        using var doc = JsonDocument.Parse(json);
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

        return Ok(await IssueTokensAsync(user));
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
    public async Task<IActionResult> CurrentUserAsync()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
            return Unauthorized();

        return Ok(new CurrentUserResponse
        {
            Id = user.Id.ToString(),
            Email = user.Email!,
            UserName = user.UserName!,
            EmailConfirmed = user.EmailConfirmed
        });
    }
    private async Task<IActionResult> IssueTokensAsync(ApplicationUser user)
    {
        var accessToken = await _tokenService.GenerateAccessTokenAsync(user);
        var (refreshToken, refreshExpires) = await _tokenService.GenerateAndStoreRefreshTokenAsync(user);
        return Ok(new TokenResponse() { AccessToken = accessToken, RefreshToken = refreshToken, RefreshTokenExpires = refreshExpires });
    }
}

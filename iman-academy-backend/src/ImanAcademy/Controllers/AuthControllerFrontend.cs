using ImanAcademy.AuthModels;
using ImanAcademy.Models;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
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

    public AuthControllerFrontend(UserManager<ApplicationUser> userManager, IJwtTokenService tokenService, SignInManager<ApplicationUser> signInManager, GoogleSignInService googleSignIn, IConfiguration config, IAntiforgery antiforgery, ILogger<AuthControllerFrontend> logger, IHttpContextAccessor httpContextAccessor)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _signInManager = signInManager;
        _googleSignIn = googleSignIn;
        _config = config;
        _antiforgery = antiforgery;
        _logger = logger;
        _httpContextAccessor = httpContextAccessor;
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
        return Ok();
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> LogoutAndClearCookiesUserAsync()
    {
        return Ok();
    }

    [Authorize]
    [HttpPost(AuthConstants.RefreshTokenCookiePath)]
    [ProducesResponseType<TokenResponse>(200)]
    public async Task<IActionResult> RefreshTokenAsync()
    {
        return Ok();
    }

    [HttpPost("google-id-token")]
    [ProducesResponseType<TokenResponse>(200)]
    public async Task<IActionResult> GoogleAuthorizationByIdTokenFlowAsync() { 
        return Ok();
    }

    [HttpPost("google-code")]
    [ProducesResponseType<TokenResponse>(200)]
    public async Task<IActionResult> GoogleAuthorizationByCodeFlowAsync()
    {
        return Ok();
    }

    [HttpPost("reset-password")]
    [ProducesResponseType(201)]
    public async Task<IActionResult> ResetPassword(string code) {
        return Ok();
    }

    [Authorize]
    [HttpPost("change-password")]
    [ProducesResponseType(201)]
    public async Task<IActionResult> ChangePasswordAsync()
    {
        return Ok();
    }

    [Authorize]
    [HttpGet("current-user")]
    public async Task<IActionResult> GetCurrentUserAsync()
    {
        return Ok();
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
}
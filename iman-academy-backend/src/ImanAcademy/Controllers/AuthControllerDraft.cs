using Google.Apis.Auth;
using ImanAcademy.AuthModels;
using ImanAcademy.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ImanAcademy.Controllers
{
    [ApiController]
    [Route("api/auth/draft")]
    public class AuthControllerDraft : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly GoogleSignInService _googleSignIn;
        private readonly IJwtTokenService _tokenService;
        private readonly IConfiguration _config;

        public AuthControllerDraft(UserManager<ApplicationUser> userManager, IJwtTokenService tokenService, SignInManager<ApplicationUser> signInManager, GoogleSignInService googleSignIn, IConfiguration config)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _signInManager = signInManager;
            _googleSignIn = googleSignIn;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            var user = new ApplicationUser { UserName = request.Email, Email = request.Email };
            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user is null || !await _userManager.CheckPasswordAsync(user, request.Password))
                return Unauthorized("Invalid email or password.");

            var accessToken = await _tokenService.GenerateAccessTokenAsync(user);
            var refreshToken = await _tokenService.GenerateAndStoreRefreshTokenAsync(user);

            return Ok(await IssueTokensAsync(user));
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh(RefreshRequest request)
        {

            if (!Request.Cookies.TryGetValue(AuthConstants.RefreshTokenCookieName, out var rawToken) || string.IsNullOrEmpty(rawToken))
                return Unauthorized("No refresh token.");

            var existing = await _tokenService.ValidateRefreshTokenAsync(rawToken);
            if (existing is null)
            {
                Response.Cookies.Delete(AuthConstants.RefreshTokenCookieName);
                return Unauthorized("Invalid or expired refresh token.");
            }

       
            
            var newAccessToken = await _tokenService.GenerateAccessTokenAsync(existing.User);
            var (newRefreshToken, refreshExpires) = await _tokenService.GenerateAndStoreRefreshTokenAsync(existing.User);

            // Rotate: revoke the old one, link it to the new one for audit purposes
            await _tokenService.RevokeRefreshTokenAsync(existing, newRefreshToken);

            return Ok(new TokenResponse()
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken
            });
        }

        [HttpPost("revoke")]
        public async Task<IActionResult> Revoke(RefreshRequest request)
        {
            var existing = await _tokenService.ValidateRefreshTokenAsync(request.RefreshToken);
            if (existing is null)
                return NotFound();

            await _tokenService.RevokeRefreshTokenAsync(existing);
            return NoContent();
        }
        [HttpGet("google/login")]
        public IActionResult GoogleLogin(string returnUrl = "/")
        {
            if (!Url.IsLocalUrl(returnUrl)) returnUrl = "/"; // block open-redirect

            var props = new AuthenticationProperties { RedirectUri = "/api/auth/google/callback-complete?returnUrl=" + Uri.EscapeDataString(returnUrl) };
            return Challenge(props, GoogleDefaults.AuthenticationScheme);
        }

        [HttpGet("google/callback-complete")]
        public async Task<IActionResult> GoogleCallbackComplete(string returnUrl)
        {
            var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);
            if (!result.Succeeded) return Redirect("/login?error=google_failed");

            var providerKey = result.Principal!.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var email = result.Principal.FindFirstValue(ClaimTypes.Email)!;

            var user = await _googleSignIn.ResolveUserAsync(providerKey, email, emailVerified: true);
            await _signInManager.SignInAsync(user, isPersistent: true); // sets the HttpOnly cookie

            if (!Url.IsLocalUrl(returnUrl)) returnUrl = "/";
            return Redirect(returnUrl);
        }
        [HttpPost("google/token")]
        public async Task<IActionResult> GoogleToken(GoogleTokenRequest request)
        {
            GoogleJsonWebSignature.Payload payload;
            try
            {
                payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken, new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { _config["Authentication:Google:ClientId"]! }
                });
            }
            catch (InvalidJwtException)
            {
                return Unauthorized("Invalid Google token.");
            }

            var user = await _googleSignIn.ResolveUserAsync(payload.Subject, payload.Email, payload.EmailVerified);

            var accessToken = await _tokenService.GenerateAccessTokenAsync(user);
            var refreshToken = await _tokenService.GenerateAndStoreRefreshTokenAsync(user);
            return Ok(new TokenResponse()
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            });
        }
        [Authorize] // accepts cookie OR bearer, transparently
        [HttpGet("me")]
        public IActionResult Me()
        {
            var id = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var email = User.FindFirstValue(ClaimTypes.Email);
            var roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value);
            return Ok(new { id, email, roles });
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] RefreshRequest? request)
        {
            // If they authenticated via cookie, clear it
            if (User.Identity?.AuthenticationType == CookieAuthenticationDefaults.AuthenticationScheme)
                await HttpContext.SignOutAsync();

            // If they sent a refresh token (JWT client), revoke it
            if (request?.RefreshToken is { } rt)
            {
                var token = await _tokenService.ValidateRefreshTokenAsync(rt);
                if (token is not null) await _tokenService.RevokeRefreshTokenAsync(token);
            }

            return NoContent();
        }
        [HttpPost("google")]
        public async Task<IActionResult> GoogleAuth(GoogleTokenRequest request)
        {
            GoogleJsonWebSignature.Payload payload;
            try
            {
                payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken, new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { _config["Authentication:Google:ClientId"]! }
                });
            }
            catch (InvalidJwtException ex)
            {
                return Unauthorized(new { error = "Invalid Google token", detail = ex.Message });
            }

            if (!payload.EmailVerified)
                return Unauthorized("Google email is not verified.");

            // Find existing user by Google login, or by email, or create new
            var user = await _userManager.FindByLoginAsync("Google", payload.Subject);

            if (user is null)
            {
                user = await _userManager.FindByEmailAsync(payload.Email);

                if (user is null)
                {
                    user = new ApplicationUser
                    {
                        UserName = payload.Email,
                        Email = payload.Email,
                        EmailConfirmed = true
                    };

                    var createResult = await _userManager.CreateAsync(user); // no password — Google-only account
                    if (!createResult.Succeeded)
                        return BadRequest(createResult.Errors);
                }

                var addLoginResult = await _userManager.AddLoginAsync(
                    user, new UserLoginInfo("Google", payload.Subject, "Google"));

                if (!addLoginResult.Succeeded)
                    return BadRequest(addLoginResult.Errors);
            }

            return await IssueTokensAsync(user); // reuses your existing helper from login/register
        }
        private async Task<IActionResult> IssueTokensAsync(ApplicationUser user)
        {
            var accessToken = await _tokenService.GenerateAccessTokenAsync(user);
            var refreshToken = await _tokenService.GenerateAndStoreRefreshTokenAsync(user);

            SetRefreshCookie(refreshToken);
            return Ok(new TokenResponse() { AccessToken = accessToken }); // only the access token is visible to JS
        }

        private void SetRefreshCookie(string rawRefreshToken)
        {


            Response.Cookies.Append(
                AuthConstants.RefreshTokenCookieName,
                rawRefreshToken,
                new CookieOptions()
                {
                    HttpOnly = true,
                    Secure = false, // allow plain http on localhost, force https elsewhere
                    SameSite = SameSiteMode.Strict, // refresh token never needs to go cross-site
                    Path = "/api/auth/refresh", // only sent to auth endpoints, not every request
                    Expires = DateTime.Now.AddDays(15)
                });
        }
    }
}

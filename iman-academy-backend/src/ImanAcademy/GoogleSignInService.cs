using ImanAcademy.Models;
using Microsoft.AspNetCore.Identity;

namespace ImanAcademy
{
    public class GoogleSignInService
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public GoogleSignInService(UserManager<ApplicationUser> userManager) => _userManager = userManager;

        // Shared by both flows: find-or-create user from verified Google identity
        public async Task<ApplicationUser> ResolveUserAsync(string providerKey, string email, bool emailVerified)
        {
            if (!emailVerified)
                throw new InvalidOperationException("Google email is not verified.");

            var existingLogin = await _userManager.FindByLoginAsync("Google", providerKey);
            if (existingLogin is not null)
                return existingLogin;

            var user = await _userManager.FindByEmailAsync(email);
            if (user is null)
            {
                user = new ApplicationUser { UserName = email, Email = email, EmailConfirmed = true };
                var createResult = await _userManager.CreateAsync(user);
                if (!createResult.Succeeded)
                    throw new InvalidOperationException(string.Join("; ", createResult.Errors.Select(e => e.Description)));
            }

            var logins = await _userManager.GetLoginsAsync(user);
            if (!logins.Any(l => l.LoginProvider == "Google" && l.ProviderKey == providerKey))
                await _userManager.AddLoginAsync(user, new UserLoginInfo("Google", providerKey, "Google"));

            return user;
        }
    }
}

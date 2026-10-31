using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ImanAcademy
{
    public class ValidateAntiforgeryTokenFilter : IAsyncActionFilter
    {
        private readonly IAntiforgery _antiforgery;

        public ValidateAntiforgeryTokenFilter(IAntiforgery antiforgery)
        {
            _antiforgery = antiforgery;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var method = context.HttpContext.Request.Method;
            if (!HttpMethods.IsGet(method) && !HttpMethods.IsHead(method) &&
                !HttpMethods.IsOptions(method) && !HttpMethods.IsTrace(method))
            {
                try
                {
                    await _antiforgery.ValidateRequestAsync(context.HttpContext);
                }
                catch (AntiforgeryValidationException)
                {
                    context.Result = new BadRequestObjectResult("Antiforgery token validation failed.");
                    return;
                }
            }

            await next();
        }
    }
}

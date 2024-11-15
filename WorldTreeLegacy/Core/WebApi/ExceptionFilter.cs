

using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using WorldTree.Core.General;
using WorldTree.Core.Util;

namespace WorldTree.Core.WebApi;

public class ExceptionFilter : IActionFilter
{
    private readonly ILogger<ExceptionFilter> logger;

    public ExceptionFilter(ILogger<ExceptionFilter> logger)
    {
        this.logger = logger;
    }

    public void OnActionExecuting(ActionExecutingContext context)
    {
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        if (context.Exception is null)
        {
            return;
        }

        context.Result = context.Exception.ToActionResult(out var statusCode, out var message);
        context.HttpContext.Response.StatusCode = statusCode;
        context.ExceptionHandled = true;

        this.logger.Error($"An error occurred while processing the request. Status Code: {statusCode}\n{context.Exception.Message}", context.Exception);
    }
}

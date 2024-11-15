

using Microsoft.AspNetCore.Mvc.Filters;

namespace WorldTree.Core.Http;

[AttributeUsage(AttributeTargets.Method)]
public class ResponseContentTypeAttribute : Attribute
{
    public string ContentType { get; }

    public ResponseContentTypeAttribute(string contentType)
    {
        this.ContentType = contentType;
    }
}

public class ResponseContentTypeFilter : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        if (context.ActionDescriptor.EndpointMetadata.OfType<ResponseContentTypeAttribute>().FirstOrDefault() is { } contentTypeAttribute)
        {
            context.HttpContext.Response.ContentType = contentTypeAttribute.ContentType;
        }

        await next();
    }
}
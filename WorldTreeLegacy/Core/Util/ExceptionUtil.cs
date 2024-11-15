

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;

namespace WorldTree.Core.Util;

public static class ExceptionUtil
{
    public static IActionResult ToActionResult(this Exception exception, out int statusCode, out string message)
    {
        if (exception is HttpStatusException httpStatusException)
        {
            statusCode = httpStatusException.StatusCode;
            message = httpStatusException.ForwardErrorMessage ? exception.Message : httpStatusException.Message;
        }
        else
        {
            statusCode = 500;
            message = "An error occurred while processing the request.";
        }

        return new ObjectResult(new Dictionary<string, object> { { "title", message }, { "status", statusCode } })
        {
            StatusCode = statusCode,
            ContentTypes = new MediaTypeCollection()
            {
                Microsoft.Net.Http.Headers.MediaTypeHeaderValue.Parse("application/json+exception")
            }
        };
    }

    public static IActionResult ToActionResult(this Exception exception) => exception.ToActionResult(out _, out _);
}

public class HttpStatusException : Exception
{
    public int StatusCode { get; }
    public bool ForwardErrorMessage { get; init; } = true;

    public HttpStatusException(string? message, int statusCode)
        : base(message)
    {
        this.StatusCode = statusCode;
    }
}

public class ServiceUnavailableException : HttpStatusException
{
    public ServiceUnavailableException(string message)
        : base(message, 503)
    {
    }
}

public class LockedException : HttpStatusException
{
    public LockedException(string message)
        : base(message, 423)
    {
    }
}

public class GoneException : HttpStatusException
{
    public GoneException(string message)
        : base(message, 410)
    {
    }
}

public class ConflictException : HttpStatusException
{
    public ConflictException(string message)
        : base(message, 409)
    {
    }
}

public class RequestTimeoutException : HttpStatusException
{
    public RequestTimeoutException(string message)
        : base(message, 408)
    {
    }
}

public class NotAcceptableException : HttpStatusException
{
    public NotAcceptableException(string message)
        : base(message, 406)
    {
    }
}

public class NotFoundException : HttpStatusException
{
    public NotFoundException(string message)
        : base(message, 404)
    {
    }
}

public class ForbiddenException : HttpStatusException
{
    public ForbiddenException(string message)
        : base(message, 403)
    {
    }
}

public class UnauthorizedException : HttpStatusException
{
    public UnauthorizedException(string? message = null)
        : base(message, 401)
    {
    }
}

public class BadRequestException : HttpStatusException
{
    public BadRequestException(string message)
        : base(message, 400)
    {
    }
}
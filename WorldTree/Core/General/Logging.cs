

using Microsoft.Extensions.Logging;

namespace WorldTree.Core.General;

public static class Logging
{
    private static readonly Action<ILogger, string, Exception?> logDebug = LoggerMessage.Define<string>(
        LogLevel.Debug,
        new EventId(1, nameof(Debug)),
        "{Message}");


    private static readonly Action<ILogger, string, Exception?> logError = LoggerMessage.Define<string>(
        LogLevel.Error,
        new EventId(1, nameof(Error)),
        "{Message}");

    public static void Debug(this ILogger logger, string message)
    {
        logDebug(logger, message, null);
    }

    public static void Error(this ILogger logger, string message, Exception? exception = null)
    {
        logError(logger, message, exception);
    }
}
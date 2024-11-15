

using System.Net.Http.Json;

namespace WorldTree.Core.Util;

public static class HttpResponseMessageExtensions
{
    public static async Task<T> ParseContent<T>(this HttpResponseMessage response)
    {
        var content = await response.Content.ReadAsStringAsync();
        if (!response.IsSuccessStatusCode)
        {
            throw new ServiceUnavailableException($"failed to parse response: {response.StatusCode} - {content}") { ForwardErrorMessage = false };
        }

        return await response.Content.ReadFromJsonAsync<T>() ?? throw new Exception($"Failed to parse response content as {typeof(T).Name}: {content}");
    }
}
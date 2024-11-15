

using System.Reflection;
using System.Text.Json.Serialization;
using System.Web;

namespace WorldTree.Core.Util;

public interface IHttpUtil
{ }

public static class HttpUtilExtensions
{
    public static FormUrlEncodedContent ToContent<T>(this T data)
        where T : notnull, IHttpUtil
        => new FormUrlEncodedContent(data.GetKeyValuePairs());

    public static string QueryString<T>(this T data)
        where T : notnull, IHttpUtil
    {
        var parts = data.GetKeyValuePairs().Select(kv => $"{kv.Key}={HttpUtility.UrlEncode(kv.Value)}");
        return parts.Any() ? $"?{string.Join("&", parts)}" : string.Empty;
    }

    private static IEnumerable<KeyValuePair<string, string>> GetKeyValuePairs<T>(this T data)
        where T : notnull
        => from property in typeof(T).GetProperties()
           let key = property.GetCustomAttribute<JsonPropertyNameAttribute>()?.Name ?? property.Name
           where key != null
           let value = property.GetValue(data)?.ToString()
           where value != null
           select new KeyValuePair<string, string>(key, value);
}

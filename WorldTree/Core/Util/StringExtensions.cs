

using Microsoft.EntityFrameworkCore;

namespace WorldTree.Core.Util;

public static class StringExtensions
{
    public static bool ContainsLower(this string? value, string? substring)
    {
        if (string.IsNullOrEmpty(value))
        {
            return string.IsNullOrEmpty(substring);
        }

        var culture = System.Globalization.CultureInfo.CurrentCulture;

        return EF.Functions.Like(substring!.ToLower(culture), $"%{value.ToLower(culture)}%");
    }
}
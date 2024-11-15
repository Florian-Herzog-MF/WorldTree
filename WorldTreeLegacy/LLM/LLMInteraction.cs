using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using DotNetEnv;

namespace WorldTree;

public class LLMApiClient
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _domain;

    public LLMApiClient(string domain, string apiKey)
    {
        // Load environment variables from .env file
        Env.Load();

        // Retrieve the values from environment variables
        _domain = Environment.GetEnvironmentVariable("GPT_4O_API_URL");
        _apiKey = Environment.GetEnvironmentVariable("GPT_4O_API_KEY");

        // Initialize HttpClient
        _httpClient = new HttpClient();
    }

    public async Task<string> CallLLMAsync(string prompt)
    {
        var requestUri = new Uri($"{_domain}/api/v1/llm_endpoint");

        var requestContent = new
        {
            prompt = prompt,
            max_tokens = 100,
            temperature = 0.7
        };

        string jsonContent = JsonConvert.SerializeObject(requestContent);
        var httpContent = new StringContent(jsonContent, Encoding.UTF8, "application/json");

        // Add authorization header
        httpContent.Headers.Add("Authorization", $"Bearer {_apiKey}");

        try
        {
            var response = await _httpClient.PostAsync(requestUri, httpContent);

            response.EnsureSuccessStatusCode();

            string responseContent = await response.Content.ReadAsStringAsync();

            return responseContent;
        }
        catch (Exception ex)
        {
            // Handle exceptions (logging, rethrowing, etc.)
            Console.WriteLine($"Request failed: {ex.Message}");
            throw;
        }
    }
}
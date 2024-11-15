

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using WorldTree.Core.General;

namespace WorldTree.Core.WebApi;

[ApiController]
[Route("api/v1")]
public class DebugController : Controller
{
    private readonly ILogger<DebugController> logger;

    public DebugController(ILogger<DebugController> logger)
    {
        this.logger = logger;
    }

    [HttpGet]
    public async Task<string> Ping()
    {
        this.logger.Debug("Ping");
        return "Hello World";
    }
}
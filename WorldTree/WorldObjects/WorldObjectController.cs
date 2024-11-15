using Microsoft.AspNetCore.Mvc;

namespace WorldTree;

[ApiController]
[Route("api/v1/wo")]
public class WorldObjectController(WorldObjectService service, EmbeddingService embeddingService) : ControllerBase
{
    [HttpGet("search")]
    public async Task<IEnumerable<WorldObject>> Search([FromQuery] string prompt, [FromQuery] int amount = 10)
    {

        var embedding = await embeddingService.Embed(prompt);
        return await service.Search(embedding, amount);
    }
}
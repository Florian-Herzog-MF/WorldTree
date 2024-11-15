using Microsoft.EntityFrameworkCore;

namespace WorldTree;

public enum WorldObjectType
{
    Character,
    Town,
    Region,
    Building,
    Item,
}

public record WorldObject
{
    public long Id { get; set; }
    public required string Name { get; set; }
    public required WorldObjectType Type { get; set; }
    public required byte[] Embedding { get; set; }
}
public class WorldObjectService(WorldTreeDbContext dbContext)
{
    public async Task<IEnumerable<WorldObject>> Search(byte[] embedding, int amount = 10)
    {
        var result = await dbContext.WorldObjects.OrderByDescending(x => CosineSimilarity(embedding, x.Embedding)).Take(amount).ToListAsync();
        return result;
    }

    private double CosineSimilarity(byte[] a, byte[] b)
    {
        double dotProduct = 0;
        double normA = 0;
        double normB = 0;
        for (int i = 0; i < a.Length; i++)
        {
            dotProduct += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        return dotProduct / (Math.Sqrt(normA) * Math.Sqrt(normB));
    }

}
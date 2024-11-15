namespace WorldTree;

public record Source
{
    public long Id { get; set; }
    public required byte[] Embedding { get; set; }
}
public class SourceService(WorldTreeDbContext dbContext)
{

}
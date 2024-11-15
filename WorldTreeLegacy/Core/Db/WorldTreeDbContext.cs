using Microsoft.EntityFrameworkCore;

namespace WorldTree;

public class WorldTreeDbContext : DbContext
{
    public WorldTreeDbContext(DbContextOptions<WorldTreeDbContext> options)
        : base(options)
    {
    }

    public DbSet<WorldObject> WorldObjects { get; set; } = null!;
}

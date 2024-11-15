
using Autofac;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using WorldTree.Core.Db;

namespace WorldTree.Core;

public class CoreModule : Module
{
    protected override void Load(ContainerBuilder builder)
    {
        builder.Register(c =>
        {
            var config = c.Resolve<IConfiguration>();
            var connectionString = config.GetConnectionString("Main");
            var optionsBuilder = new DbContextOptionsBuilder<WorldTreeDbContext>();
            optionsBuilder.UseMySql(
                connectionString,
                ServerVersion.AutoDetect(connectionString));
            return optionsBuilder.Options;
        });

        builder.RegisterType<WorldTreeDbContext>()
            .AsSelf()
            .InstancePerLifetimeScope();

        builder.RegisterType<DbMigrator>()
            .AsSelf()
            .AsImplementedInterfaces()
            .InstancePerLifetimeScope();
    }
}
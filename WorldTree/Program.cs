

using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.Json.Serialization.Metadata;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using WorldTree;
using WorldTree.Core;
using WorldTree.Core.WebApi;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: false, reloadOnChange: true)
    .AddEnvironmentVariables();

builder.Services.AddDbContext<WorldTreeDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("Main");
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
});

builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());

builder.Host.ConfigureContainer<ContainerBuilder>((hostBuilder, autofacBuilder) =>
{
    autofacBuilder.RegisterModule<CoreModule>();
    autofacBuilder.RegisterType<WorldObjectService>().AsSelf().InstancePerLifetimeScope();
    autofacBuilder.RegisterType<SourceService>().AsSelf().InstancePerLifetimeScope();
});

builder.Services.AddHttpsRedirection(options =>
{
    options.RedirectStatusCode = StatusCodes.Status307TemporaryRedirect;
    options.HttpsPort = 5001;
});
builder.Services.AddHttpClient();
builder.Services.AddControllers(options =>
{
    options.Filters.Add<ExceptionFilter>();
})
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.MaxDepth = 32;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = false;
        options.JsonSerializerOptions.NumberHandling = JsonNumberHandling.AllowNamedFloatingPointLiterals;
        options.JsonSerializerOptions.IncludeFields = true;
        options.JsonSerializerOptions.TypeInfoResolver = new DefaultJsonTypeInfoResolver();
    });

var app = builder.Build();

app.UseRouting();

app.UseCors(b => b.AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials()
    .WithOrigins("http://localhost:4200")
    .SetIsOriginAllowedToAllowWildcardSubdomains());

app.MapControllers();

app.Run();

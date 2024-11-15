

namespace WorldTree.Core.DependencyInjection;

[AttributeUsage(AttributeTargets.Class)]
public class InjectableAttribute : Attribute
{
    public InjectableLifetime Lifetime { get; }
    public bool AutoActivate { get; }
    public InjectableAttribute(InjectableLifetime lifetime = InjectableLifetime.Scoped, bool autoActivate = false)
    {
        this.Lifetime = lifetime;
        this.AutoActivate = autoActivate;
    }
}

public enum InjectableLifetime
{
    Transient,
    Scoped,
    Singleton
}

[AttributeUsage(AttributeTargets.Class)]
public class ServiceAttribute : InjectableAttribute
{
    public ServiceAttribute()
        : base(InjectableLifetime.Scoped, false)
    {
    }
}

[AttributeUsage(AttributeTargets.Class)]
public class SingletonAttribute : InjectableAttribute
{
    public SingletonAttribute()
        : base(InjectableLifetime.Singleton, true)
    {
    }
}



using System.Runtime.CompilerServices;
using Autofac;
using Autofac.Core.Resolving.Pipeline;

namespace WorldTree.Core.DependencyInjection;

public class ResolveMiddleware : IResolveMiddleware
{
    public PipelinePhase Phase => PipelinePhase.Activation;

    public void Execute(ResolveRequestContext context, Action<ResolveRequestContext> next)
    {
        next(context);

        var instance = context.Instance!;

        foreach (var info in instance.GetType().GetFields().Where(info => Attribute.IsDefined(info, typeof(RequiredMemberAttribute))))
        {
            var dependency = context.Resolve(info.FieldType) ?? throw new ArgumentNullException(info.Name);
            info.SetValue(instance, dependency);
        }

        foreach (var info in instance.GetType().GetMethods().Where(info => Attribute.IsDefined(info, typeof(OnActivatedAttribute))))
        {
            using (var scope = context.ActivationScope.BeginLifetimeScope())
            {
                info.Invoke(instance, [scope]);
            }
        }
    }
}
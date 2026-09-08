using ImanAcademy.Models;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

namespace ImanAcademy.Integration.Tests.Setup;

public abstract class BaseIntegrationTest : IClassFixture<IntegrationTestWebAppFactory>, IDisposable
{
    private readonly IServiceScope _scope;

    // Real HTTP calls into the TestServer - this is what makes these
    // end-to-end tests rather than tests against the DbContext directly.
    protected readonly HttpClient Client;

    // Available for arranging state the API can't create, or asserting DB
    // state the API's response DTOs don't expose.
    protected readonly ImanAcademyContext DbContext;
    protected readonly IntegrationTestWebAppFactory Factory;

    protected IServiceProvider ServiceProvider => _scope.ServiceProvider;

    protected BaseIntegrationTest(IntegrationTestWebAppFactory factory)
    {
        _scope = factory.Services.CreateScope();
        Client = factory.CreateClient();
        DbContext = _scope.ServiceProvider.GetRequiredService<ImanAcademyContext>();
        Factory = factory;
    }

    public void Dispose()
    {
        _scope.Dispose();
        DbContext.Dispose();
    }
}

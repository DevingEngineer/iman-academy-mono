using ImanAcademy.DTOs;
using ImanAcademy.Integration.Tests.Setup;
using ImanAcademy.Integration.Tests.Utilities;
using ImanAcademy.Models;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http.Json;
using System.Text;

namespace ImanAcademy.Integration.Tests.Tests;


public class ModulesControllerTests : BaseIntegrationTest
{
    public ModulesControllerTests(IntegrationTestWebAppFactory factory) : base(factory)
    {
    }

    [Fact]
    public async Task GetById_ShouldReturnModule_WhenExists()
    {
        var course = await Client.CreateCourseAsync();
        var module = await Client.CreateModuleAsync(course.Id);

        var response = await Client.GetAsync($"/api/modules/{module.Id}");

        response.EnsureSuccessStatusCode();
        var fetched = await response.Content.ReadFromJsonAsync<ModuleDto>(TestDataHelpers.JsonOptions);
        Assert.Equal(module.Id, fetched!.Id);
        Assert.Equal(course.Id, fetched.CourseId);
    }

    [Fact]
    public async Task GetById_ShouldReturn404_WhenModuleDoesNotExist()
    {
        var response = await Client.GetAsync($"/api/modules/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Update_ShouldModifyModule()
    {
        var course = await Client.CreateCourseAsync();
        var module = await Client.CreateModuleAsync(course.Id);

        var dto = new UpdateModuleDto { Title = "Renamed Module", Order = 2, Status = ContentStatus.Published };
        var response = await Client.PutAsJsonAsync($"/api/modules/{module.Id}", dto);

        response.EnsureSuccessStatusCode();
        var updated = await response.Content.ReadFromJsonAsync<ModuleDto>(TestDataHelpers.JsonOptions);
        Assert.Equal("Renamed Module", updated!.Title);
        Assert.Equal(ContentStatus.Published, updated.Status);
    }

    [Fact]
    public async Task Delete_ShouldRemoveModule()
    {
        var course = await Client.CreateCourseAsync();
        var module = await Client.CreateModuleAsync(course.Id);

        var response = await Client.DeleteAsync($"/api/modules/{module.Id}");
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

        var getResponse = await Client.GetAsync($"/api/modules/{module.Id}");
        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
    }

    [Fact]
    public async Task CreateSubModule_ShouldAppearInModulesSubModuleList()
    {
        var course = await Client.CreateCourseAsync();
        var module = await Client.CreateModuleAsync(course.Id);

        var dto = new CreateSubModuleDto { Title = "SubModule A", Order = 1 };
        var createResponse = await Client.PostAsJsonAsync($"/api/modules/{module.Id}/submodules", dto);
        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);

        var listResponse = await Client.GetAsync($"/api/modules/{module.Id}/submodules");
        var subModules = await listResponse.Content.ReadFromJsonAsync<List<SubModuleDto>>(TestDataHelpers.JsonOptions);
        Assert.Single(subModules!);
        Assert.Equal("SubModule A", subModules![0].Title);
    }
}

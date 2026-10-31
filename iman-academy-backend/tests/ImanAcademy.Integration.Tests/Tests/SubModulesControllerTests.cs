using ImanAcademy.DTOs;
using ImanAcademy.Integration.Tests.Setup;
using ImanAcademy.Integration.Tests.Utilities;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http.Json;
using System.Text;

namespace ImanAcademy.Integration.Tests.Tests;


public class SubModulesControllerTests : BaseIntegrationTest
{
    public SubModulesControllerTests(IntegrationTestWebAppFactory factory) : base(factory)
    {
    }

    [Fact]
    public async Task GetById_ShouldReturnSubModule_WhenExists()
    {
        var (module, subModule) = await CreateModuleAndSubModuleAsync();

        var response = await Client.GetAsync($"/api/submodules/{subModule.Id}");

        response.EnsureSuccessStatusCode();
        var fetched = await response.Content.ReadFromJsonAsync<SubModuleDto>(TestDataHelpers.JsonOptions);
        Assert.Equal(subModule.Id, fetched!.Id);
        Assert.Equal(module.Id, fetched.ModuleId);
    }

    [Fact]
    public async Task Update_ShouldModifySubModule()
    {
        var (_, subModule) = await CreateModuleAndSubModuleAsync();

        var dto = new UpdateSubModuleDto { Title = "Renamed SubModule", Order = 5 };
        var response = await Client.PutAsJsonAsync($"/api/submodules/{subModule.Id}", dto);

        response.EnsureSuccessStatusCode();
        var updated = await response.Content.ReadFromJsonAsync<SubModuleDto>(TestDataHelpers.JsonOptions);
        Assert.Equal("Renamed SubModule", updated!.Title);
        Assert.Equal(5, updated.Order);
    }

    [Fact]
    public async Task Delete_ShouldRemoveSubModule()
    {
        var (_, subModule) = await CreateModuleAndSubModuleAsync();

        var response = await Client.DeleteAsync($"/api/submodules/{subModule.Id}");
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

        var getResponse = await Client.GetAsync($"/api/submodules/{subModule.Id}");
        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
    }

    [Fact]
    public async Task GetSteps_ShouldReturnAllThreeTypes_OrderedByOrder()
    {
        var (_, subModule) = await CreateModuleAndSubModuleAsync();

        // Created out of order on purpose to prove the response is sorted.
        await Client.CreateContentStepAsync(subModule.Id, order: 2);
        await Client.CreateVideoStepAsync(subModule.Id, order: 1);
        await Client.CreateQuizStepAsync(subModule.Id, order: 3);

        var response = await Client.GetAsync($"/api/submodules/{subModule.Id}/steps");

        response.EnsureSuccessStatusCode();
        var steps = await response.Content.ReadFromJsonAsync<List<StepDto>>(TestDataHelpers.JsonOptions);

        Assert.Equal(3, steps!.Count);
        Assert.IsType<VideoStepDto>(steps[0]);
        Assert.IsType<ContentStepDto>(steps[1]);
        Assert.IsType<QuizStepDto>(steps[2]);
    }

    [Fact]
    public async Task GetSteps_ShouldReturn404_WhenSubModuleDoesNotExist()
    {
        var response = await Client.GetAsync($"/api/submodules/{Guid.NewGuid()}/steps");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    private async Task<(ModuleDto Module, SubModuleDto SubModule)> CreateModuleAndSubModuleAsync()
    {
        var course = await Client.CreateCourseAsync();
        var module = await Client.CreateModuleAsync(course.Id);
        var subModule = await Client.CreateSubModuleAsync(module.Id);
        return (module, subModule);
    }
}

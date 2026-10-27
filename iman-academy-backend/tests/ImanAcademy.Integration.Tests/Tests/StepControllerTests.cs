using ImanAcademy.DTOs;
using ImanAcademy.Integration.Tests.Setup;
using ImanAcademy.Integration.Tests.Utilities;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http.Json;
using System.Text;

namespace ImanAcademy.Integration.Tests.Tests;

public class StepsControllerTests : BaseIntegrationTest
{
    public StepsControllerTests(IntegrationTestWebAppFactory factory) : base(factory)
    {
    }

    [Fact]
    public async Task GetById_ShouldReturnContentStep_WithCorrectDiscriminator()
    {
        var subModule = await Client.CreateSubModuleChainAsync();
        var created = await Client.CreateContentStepAsync(subModule.Id);

        var response = await Client.GetAsync($"/api/steps/{created.Id}");

        response.EnsureSuccessStatusCode();
        var fetched = await response.Content.ReadFromJsonAsync<ContentStepDto>(TestDataHelpers.JsonOptions);
        var contentStep = Assert.IsType<ContentStepDto>(fetched);
        Assert.Equal(created.Body, contentStep.Body);
    }

    [Fact]
    public async Task GetById_ShouldReturnQuizStep_WithQuestionsAndOptions()
    {
        var subModule = await Client.CreateSubModuleChainAsync();
        var created = await Client.CreateQuizStepAsync(subModule.Id);

        var response = await Client.GetAsync($"/api/steps/{created.Id}");

        var fetched = await response.Content.ReadFromJsonAsync<QuizStepDto>(TestDataHelpers.JsonOptions);
        var quizStep = Assert.IsType<QuizStepDto>(fetched);
        Assert.NotEmpty(quizStep.Questions);
        Assert.NotEmpty(quizStep.Questions[0].Options);
    }

    [Fact]
    public async Task GetById_ShouldReturn404_WhenStepDoesNotExist()
    {
        var response = await Client.GetAsync($"/api/steps/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Update_ShouldReplaceAttachments_WhenSameType()
    {
        var subModule = await Client.CreateSubModuleChainAsync();
        var created = await Client.CreateContentStepAsync(subModule.Id);

        var updateDto = new ContentStepUpsertDto
        {
            Title = created.Title,
            Order = created.Order,
            Body = "Updated body",
            Attachments = new List<StepAttachmentUpsertDto>
            {
                new() { Name = "slides.pdf", Url = "https://example.com/slides.pdf", MimeType = "application/pdf" },
            },
        };

        var response = await Client.PutAsJsonAsync<StepUpsertDto>($"/api/steps/{created.Id}", updateDto);

        response.EnsureSuccessStatusCode();
        var updated = await response.Content.ReadFromJsonAsync<ContentStepDto>(TestDataHelpers.JsonOptions);
        var contentStep = Assert.IsType<ContentStepDto>(updated);
        Assert.Equal("Updated body", contentStep.Body);
        Assert.Single(contentStep.Attachments);
        Assert.Equal("slides.pdf", contentStep.Attachments[0].Name);
    }

    [Fact]
    public async Task Update_ShouldReturnConflict_WhenChangingStepType()
    {
        var subModule = await Client.CreateSubModuleChainAsync();
        var created = await Client.CreateContentStepAsync(subModule.Id);

        // Same step id, but a VideoStep payload - not allowed under TPC,
        // since ContentSteps and VideoSteps are different physical tables.
        var mismatchedDto = new VideoStepUpsertDto
        {
            Title = created.Title,
            Order = created.Order,
            VideoUrl = "https://example.com/video.mp4",
            DurationSeconds = 120,
        };

        var response = await Client.PutAsJsonAsync<StepUpsertDto>($"/api/steps/{created.Id}", mismatchedDto);

        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
    }

    [Fact]
    public async Task Delete_ShouldRemoveStep()
    {
        var subModule = await Client.CreateSubModuleChainAsync();
        var created = await Client.CreateVideoStepAsync(subModule.Id);

        var response = await Client.DeleteAsync($"/api/steps/{created.Id}");
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

        var getResponse = await Client.GetAsync($"/api/steps/{created.Id}");
        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
    }
}
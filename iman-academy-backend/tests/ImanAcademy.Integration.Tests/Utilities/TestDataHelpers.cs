using ImanAcademy.DTOs;
using ImanAcademy.Models;
using System;
using System.Collections.Generic;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace ImanAcademy.Integration.Tests.Utilities;
public static class TestDataHelpers
{
    public static readonly JsonSerializerOptions JsonOptions = new()
    {
        Converters = { new JsonStringEnumConverter() },
        PropertyNameCaseInsensitive = true
    };
    public static async Task<CourseDto> CreateCourseAsync(this HttpClient client, string? title = null)
    {
        var dto = new CreateCourseDto
        {
            Title = title ?? $"Course {Guid.NewGuid()}",
            Slug = $"course-{Guid.NewGuid():N}",
            Description = "Test course",
            Level = CourseLevel.Beginner,
            Language = "en",
            Price = 49.99m,
            Currency = "USD",
            Status = ContentStatus.Draft,
        };

        var response = await client.PostAsJsonAsync("/api/courses", dto, TestDataHelpers.JsonOptions);
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<CourseDto>(TestDataHelpers.JsonOptions))!;
    }

    public static async Task<ModuleDto> CreateModuleAsync(this HttpClient client, Guid courseId, int order = 1)
    {
        var dto = new CreateModuleDto { Title = $"Module {Guid.NewGuid()}", Order = order };

        var response = await client.PostAsJsonAsync($"/api/courses/{courseId}/modules", dto);
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<ModuleDto>(TestDataHelpers.JsonOptions))!;
    }

    public static async Task<SubModuleDto> CreateSubModuleAsync(this HttpClient client, Guid moduleId, int order = 1)
    {
        var dto = new CreateSubModuleDto { Title = $"SubModule {Guid.NewGuid()}", Order = order };

        var response = await client.PostAsJsonAsync($"/api/modules/{moduleId}/submodules", dto);
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<SubModuleDto>(TestDataHelpers.JsonOptions))!;
    }

    // Builds a full Course -> Module -> SubModule chain in one call, for tests
    // that only care about the SubModule (e.g. Step tests).
    public static async Task<SubModuleDto> CreateSubModuleChainAsync(this HttpClient client)
    {
        var course = await client.CreateCourseAsync();
        var module = await client.CreateModuleAsync(course.Id);
        return await client.CreateSubModuleAsync(module.Id);
    }

    public static async Task<ContentStepDto> CreateContentStepAsync(
        this HttpClient client, Guid subModuleId, int order = 1)
    {
        var dto = new ContentStepUpsertDto
        {
            Title = $"Content Step {Guid.NewGuid()}",
            Order = order,
            Body = "Some lesson body text.",
        };

        // Must post with the base StepUpsertDto type parameter so
        // System.Text.Json writes the "stepType" discriminator.
        var response = await client.PostAsJsonAsync<StepUpsertDto>($"/api/submodules/{subModuleId}/steps", dto, TestDataHelpers.JsonOptions);
        response.EnsureSuccessStatusCode();
        return (ContentStepDto)(await response.Content.ReadFromJsonAsync<ContentStepDto>(TestDataHelpers.JsonOptions))!;
    }

    public static async Task<VideoStepDto> CreateVideoStepAsync(
        this HttpClient client, Guid subModuleId, int order = 1)
    {
        var dto = new VideoStepUpsertDto
        {
            Title = $"Video Step {Guid.NewGuid()}",
            Order = order,
            VideoUrl = "https://example.com/video.mp4",
            DurationSeconds = 300,
        };

        var response = await client.PostAsJsonAsync<StepUpsertDto>($"/api/submodules/{subModuleId}/steps", dto, TestDataHelpers.JsonOptions);
        response.EnsureSuccessStatusCode();
        return (VideoStepDto)(await response.Content.ReadFromJsonAsync<VideoStepDto>(TestDataHelpers.JsonOptions))!;
    }

    public static async Task<QuizStepDto> CreateQuizStepAsync(
        this HttpClient client, Guid subModuleId, int order = 1)
    {
        var dto = new QuizStepUpsertDto
        {
            Title = $"Quiz Step {Guid.NewGuid()}",
            Order = order,
            PassingScorePercent = 70,
            AllowRetake = true,
            Questions = new List<QuizQuestionUpsertDto>
            {
                new()
                {
                    Prompt = "What does EF stand for?",
                    Type = QuestionType.SingleChoice,
                    Points = 10,
                    Options = new List<QuizOptionUpsertDto>
                    {
                        new() { Text = "Entity Framework", IsCorrect = true },
                        new() { Text = "Enterprise Framework", IsCorrect = false },
                    },
                },
            },
        };

        var response = await client.PostAsJsonAsync<StepUpsertDto>($"/api/submodules/{subModuleId}/steps", dto, TestDataHelpers.JsonOptions);
        response.EnsureSuccessStatusCode();
        return (QuizStepDto)(await response.Content.ReadFromJsonAsync<QuizStepDto>(TestDataHelpers.JsonOptions))!;
    }
}
using ImanAcademy.DTOs;
using ImanAcademy.Integration.Tests.Setup;
using ImanAcademy.Integration.Tests.Utilities;
using ImanAcademy.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http.Json;
using System.Text;

namespace ImanAcademy.Integration.Tests.Tests;


public class CoursesControllerTests : BaseIntegrationTest
{
    public CoursesControllerTests(IntegrationTestWebAppFactory factory) : base(factory)
    {
    }

    [Fact]
    public async Task Create_ShouldPersistCourseWithTags()
    {
        var dto = new CreateCourseDto
        {
            Title = "Intro to EF Core",
            Slug = $"intro-ef-core-{Guid.NewGuid():N}",
            Description = "Learn EF Core from scratch",
            Level = CourseLevel.Beginner,
            Language = "en",
            Price = 29.99m,
            Currency = "USD",
            Status = ContentStatus.Published,
            Tags = new List<string> { "ef-core", "dotnet" },
        };

        var response = await Client.PostAsJsonAsync("/api/courses", dto);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var created = await response.Content.ReadFromJsonAsync<CourseDto>(TestDataHelpers.JsonOptions);
        Assert.NotNull(created);
        Assert.Equal(dto.Title, created!.Title);
        Assert.Equal(2, created.Tags.Count);

        // Confirm it's really in the database, not just echoed back.
        var courseInDb = await DbContext.Courses.FindAsync(created.Id);
        Assert.NotNull(courseInDb);
    }

    [Fact]
    public async Task GetById_ShouldReturnCourse_WhenExists()
    {
        var created = await Client.CreateCourseAsync();

        var response = await Client.GetAsync($"/api/courses/{created.Id}");

        response.EnsureSuccessStatusCode();
        var fetched = await response.Content.ReadFromJsonAsync<CourseDto?>(TestDataHelpers.JsonOptions);
        Assert.Equal(created.Id, fetched!.Id);
    }

    [Fact]
    public async Task GetById_ShouldReturn404_WhenCourseDoesNotExist()
    {
        var response = await Client.GetAsync($"/api/courses/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Update_ShouldReplaceFieldsAndTags()
    {
        var created = await Client.CreateCourseAsync();

        var updateDto = new UpdateCourseDto
        {
            Title = "Updated Title",
            Slug = created.Slug,
            Description = "Updated description",
            Level = CourseLevel.Advanced,
            Language = "en",
            Price = 99.99m,
            Currency = "USD",
            Status = ContentStatus.Published,
            Tags = new List<string> { "advanced" },
        };

        var response = await Client.PutAsJsonAsync($"/api/courses/{created.Id}", updateDto, TestDataHelpers.JsonOptions);

        response.EnsureSuccessStatusCode();
        var updated = await response.Content.ReadFromJsonAsync<CourseDto>(TestDataHelpers.JsonOptions);
        Assert.Equal("Updated Title", updated!.Title);
        Assert.Equal(CourseLevel.Advanced, updated.Level);
        Assert.Single(updated.Tags);
        Assert.Equal("advanced", updated.Tags[0]);
    }

    [Fact]
    public async Task Delete_ShouldRemoveCourse()
    {
        var created = await Client.CreateCourseAsync();

        var response = await Client.DeleteAsync($"/api/courses/{created.Id}");
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

        var getResponse = await Client.GetAsync($"/api/courses/{created.Id}");
        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
    }

    [Fact]
    public async Task CreateModule_ShouldAppearInCoursesModuleList()
    {
        var course = await Client.CreateCourseAsync();

        var moduleDto = new CreateModuleDto { Title = "Module 1", Order = 1 };
        var createResponse = await Client.PostAsJsonAsync($"/api/courses/{course.Id}/modules", moduleDto, TestDataHelpers.JsonOptions);
        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);

        var listResponse = await Client.GetAsync($"/api/courses/{course.Id}/modules");
        var modules = await listResponse.Content.ReadFromJsonAsync<List<ModuleDto>>(TestDataHelpers.JsonOptions);
        Assert.Single(modules!);
        Assert.Equal("Module 1", modules![0].Title);
    }
}

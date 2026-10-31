using ImanAcademy.Dto;
using ImanAcademy.Integration.Tests.Setup;
using ImanAcademy.Integration.Tests.Utilities;
using ImanAcademy.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Xunit;

namespace ImanAcademy.Integration.Tests.Tests;

/// <summary>
/// Integration tests for the EnrollmentsController.
/// Tests student enrollment requests and admin enrollment operations.
/// </summary>
public class EnrollmentsControllerTests : BaseIntegrationTest
{
    public EnrollmentsControllerTests(IntegrationTestWebAppFactory factory) : base(factory)
    {
    }

    [Fact]
    public async Task RequestEnrollment_ShouldCreatePendingRequest_WhenAuthenticated()
    {
        // Arrange: Create a test user, course, and authenticate the client
        var user = await CreateTestUserAsync("student@test.com", "Password@123");
        var course = await Client.CreateCourseAsync("Advanced C# Programming");
        var jwtToken = await GenerateJwtTokenAsync(user);

        Client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", jwtToken);

        var dto = new EnrollmentCreateDto { CourseId = course.Id };

        // Act
        var response = await Client.PostAsJsonAsync("/api/enrollments/request", dto, TestDataHelpers.JsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.Accepted, response.StatusCode);

        // Verify enrollment was created in DB with PendingRequest status
        var enrollment = DbContext.Enrollments.FirstOrDefault(
            e => e.ApplicationUserId == user.Id && e.CourseId == course.Id);
        Assert.NotNull(enrollment);
        Assert.Equal(EnrollmentStatus.PendingRequest, enrollment!.Status);
        Assert.NotNull(enrollment.EnrolledAt);
    }

    [Fact]
    public async Task RequestEnrollment_ShouldReturn401_WhenNotAuthenticated()
    {
        // Arrange
        var course = await Client.CreateCourseAsync();
        var dto = new EnrollmentCreateDto { CourseId = course.Id };

        // Clear any authentication headers
        Client.DefaultRequestHeaders.Authorization = null;

        // Act
        var response = await Client.PostAsJsonAsync("/api/enrollments/request", dto, TestDataHelpers.JsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task RequestEnrollment_ShouldFailWithBadRequest_WhenUserHasActiveEnrollment()
    {
        // Arrange
        var user = await CreateTestUserAsync("student2@test.com", "Password@123");
        var course = await Client.CreateCourseAsync();

        // Create an active enrollment manually
        var activeEnrollment = new Enrollment
        {
            Id = Guid.NewGuid(),
            ApplicationUserId = user.Id,
            CourseId = course.Id,
            EnrolledAt = DateTime.UtcNow,
            Status = EnrollmentStatus.Active,
            ProgressPercent = 0m
        };
        DbContext.Enrollments.Add(activeEnrollment);
        await DbContext.SaveChangesAsync();

        var jwtToken = await GenerateJwtTokenAsync(user);
        Client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", jwtToken);

        var dto = new EnrollmentCreateDto { CourseId = course.Id };

        // Act
        var response = await Client.PostAsJsonAsync("/api/enrollments/request", dto, TestDataHelpers.JsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task RequestEnrollment_ShouldReturnBadRequest_WhenCourseDoesNotExist()
    {
        // Arrange
        var user = await CreateTestUserAsync("student3@test.com", "Password@123");
        var jwtToken = await GenerateJwtTokenAsync(user);
        Client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", jwtToken);

        var dto = new EnrollmentCreateDto { CourseId = Guid.NewGuid() };

        // Act
        var response = await Client.PostAsJsonAsync("/api/enrollments/request", dto, TestDataHelpers.JsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task RequestEnrollment_ShouldAllowReenrollment_AfterCancelledStatus()
    {
        // Arrange
        var user = await CreateTestUserAsync("student4@test.com", "Password@123");
        var course = await Client.CreateCourseAsync();

        // Create a cancelled enrollment
        var cancelledEnrollment = new Enrollment
        {
            Id = Guid.NewGuid(),
            ApplicationUserId = user.Id,
            CourseId = course.Id,
            EnrolledAt = DateTime.UtcNow.AddMonths(-1),
            Status = EnrollmentStatus.Cancelled,
            ProgressPercent = 50m
        };
        DbContext.Enrollments.Add(cancelledEnrollment);
        await DbContext.SaveChangesAsync();

        var jwtToken = await GenerateJwtTokenAsync(user);
        Client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", jwtToken);

        var dto = new EnrollmentCreateDto { CourseId = course.Id };

        // Act
        var response = await Client.PostAsJsonAsync("/api/enrollments/request", dto, TestDataHelpers.JsonOptions);

        // Assert
        Assert.Equal(HttpStatusCode.Accepted, response.StatusCode);

        // Verify a new enrollment was created
        var enrollments = DbContext.Enrollments
            .Where(e => e.ApplicationUserId == user.Id && e.CourseId == course.Id)
            .OrderBy(e => e.EnrolledAt)
            .ToList();

        Assert.Equal(2, enrollments.Count);
        Assert.Equal(EnrollmentStatus.Cancelled, enrollments[0].Status);
        Assert.Equal(EnrollmentStatus.PendingRequest, enrollments[1].Status);
    }

    // Helper methods

    private async Task<ApplicationUser> CreateTestUserAsync(string email, string password)
    {
        var userManager = ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            EmailConfirmed = true,
            FirstName = "Test",
            LastName = "User"
        };

        var result = await userManager.CreateAsync(user, password);
        if (!result.Succeeded)
        {
            throw new InvalidOperationException(
                $"Failed to create test user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
        }

        return user;
    }

    private async Task<string> GenerateJwtTokenAsync(ApplicationUser user)
    {
        var jwtService = ServiceProvider.GetRequiredService<IJwtTokenService>();
        return await jwtService.GenerateAccessTokenAsync(user);
    }
}
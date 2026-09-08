using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using ImanAcademy.Dto;
using ImanAcademy.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ImanAcademy.Services
{
    public class EnrollmentService : IEnrollmentService
    {
        private readonly ImanAcademyContext _db;
        private readonly IEmailService _email;
        private readonly ILogger<EnrollmentService> _logger;

        public EnrollmentService(ImanAcademyContext db, IEmailService email, ILogger<EnrollmentService> logger)
        {
            _db = db;
            _email = email;
            _logger = logger;
        }

        public async Task RequestEnrollment(Guid userId, Guid courseId)
        {
            var course = await _db.Courses.FindAsync(courseId);
            if (course == null) throw new InvalidOperationException("Course not found");

            var existingActive = await _db.Enrollments
                .AnyAsync(e => e.ApplicationUserId == userId && e.CourseId == courseId && e.Status == EnrollmentStatus.Active);

            if (existingActive)
                throw new InvalidOperationException("User already has an active enrollment for this course.");

            var enrollment = new Enrollment
            {
                Id = Guid.NewGuid(),
                ApplicationUserId = userId,
                CourseId = courseId,
                EnrolledAt = DateTime.UtcNow,
                Status = EnrollmentStatus.PendingRequest,
                ProgressPercent = 0m
            };

            _db.Enrollments.Add(enrollment);
            await _db.SaveChangesAsync();

            // notify student
            var user = await _db.Users.FindAsync(userId);
            try
            {
                if (user != null && !string.IsNullOrEmpty(user.Email))
                {
                    await _email.SendEmailAsync(user.Email, "Enrollment request received",
                        $"Your request to enroll in course '{course.Title}' has been received and is pending admin approval.");
                }

                // notify admins - send simple aggregate to configured admin address or to all users in Admin role
                var adminEmail = "admin@admin.com"; // fallback; IdentitySeeder uses this email
                await _email.SendEmailAsync(adminEmail, "New enrollment request",
                    $"User '{user?.Email}' requested enrollment to '{course.Title}'.");
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to send enrollment request emails");
            }
        }

        public async Task EnrollStudents(IEnumerable<Guid> studentIds, Guid courseId)
        {
            var course = await _db.Courses.FindAsync(courseId);
            if (course == null) throw new InvalidOperationException("Course not found");

            var toCreate = new List<Enrollment>();

            foreach (var sid in studentIds)
            {
                var existingActive = await _db.Enrollments
                    .AnyAsync(e => e.ApplicationUserId == sid && e.CourseId == courseId && e.Status == EnrollmentStatus.Active);
                if (existingActive) continue;

                var enrollment = new Enrollment
                {
                    Id = Guid.NewGuid(),
                    ApplicationUserId = sid,
                    CourseId = courseId,
                    EnrolledAt = DateTime.UtcNow,
                    Status = EnrollmentStatus.Active,
                    ProgressPercent = 0m
                };
                toCreate.Add(enrollment);
            }

            if (toCreate.Count > 0)
            {
                await _db.Enrollments.AddRangeAsync(toCreate);
                await _db.SaveChangesAsync();

                foreach (var e in toCreate)
                {
                    try
                    {
                        var user = await _db.Users.FindAsync(e.ApplicationUserId);
                        if (user != null && !string.IsNullOrEmpty(user.Email))
                        {
                            await _email.SendEmailAsync(user.Email, "You have been enrolled",
                                $"You were enrolled in the course '{course.Title}' by an administrator.");
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "Failed to send enrollment email to user {UserId}", e.ApplicationUserId);
                    }

                }
            }
        }

        public async Task ApproveRequest(Guid enrollmentId)
        {
            var enrollment = await _db.Enrollments.FindAsync(enrollmentId);
            if (enrollment == null) throw new InvalidOperationException("Enrollment not found");

            enrollment.Status = EnrollmentStatus.Active;
            enrollment.EnrolledAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            try
            {
                var course = await _db.Courses.FindAsync(enrollment.CourseId);
                var user = await _db.Users.FindAsync(enrollment.ApplicationUserId);
                if (user != null && !string.IsNullOrEmpty(user.Email))
                {
                    await _email.SendEmailAsync(user.Email, "Enrollment approved",
                        $"Your enrollment to '{course?.Title}' has been approved.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to send enrollment approval email");
            }
        }

        public async Task<List<AdminEnrollmentDto>> GetAllEnrollments()
        {
            return await _db.Enrollments
                .AsNoTracking()
                .OrderByDescending(e => e.EnrolledAt)
                .Select(e => new AdminEnrollmentDto
                {
                    EnrollmentId = e.Id,
                    StudentId = e.ApplicationUserId,
                    StudentName = (e.ApplicationUser.FirstName + " " + e.ApplicationUser.LastName).Trim(),
                    StudentEmail = e.ApplicationUser.Email,
                    CourseId = e.CourseId,
                    CourseTitle = e.Course.Title,
                    Status = e.Status,
                    EnrolledAt = e.EnrolledAt,
                    CompletedAt = e.CompletedAt,
                    ProgressPercent = e.ProgressPercent
                })
                .ToListAsync();
        }
    }
}

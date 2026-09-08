using System;
using System.Security.Claims;
using System.Threading.Tasks;
using ImanAcademy.Dto;
using ImanAcademy.DTOs;
using ImanAcademy.Models;
using ImanAcademy.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace ImanAcademy.Controllers
{
    [ApiController]
    [Route("api/enrollments")]
    public class EnrollmentsController : ControllerBase
    {
        private readonly IEnrollmentService _enrollmentService;
        private readonly ImanAcademyContext _context;

        public EnrollmentsController(IEnrollmentService enrollmentService, ImanAcademyContext context)
        {
            _enrollmentService = enrollmentService;
            _context = context;
        }

        [HttpGet("my")]
        [Authorize]
        public async Task<ActionResult<List<CourseDto>>> GetMyEnrolledCourses()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(idClaim, out var userId))
                return Unauthorized();

            var courses = await _context.Enrollments
                .Where(e => e.ApplicationUserId == userId && e.Status == EnrollmentStatus.Active)
                .Include(e => e.Course)
                    .ThenInclude(c => c.CourseTags)
                        .ThenInclude(ct => ct.Tag)
                .OrderByDescending(e => e.EnrolledAt)
                .Select(e => new
                {
                    Course = e.Course,
                    ModulesCount = e.Course.Modules.Count
                })
                .ToListAsync();

            return Ok(courses.Select(c => c.Course.ToDto(c.ModulesCount)).ToList());
        }

        [HttpGet("my/{courseId:guid}")]
        [Authorize]
        public async Task<ActionResult<StudentEnrollmentDto>> GetMyEnrollment(Guid courseId)
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(idClaim, out var userId))
                return Unauthorized();

            var enrollment = await _context.Enrollments
                .AsNoTracking()
                .Where(e => e.ApplicationUserId == userId && e.CourseId == courseId)
                .Include(e => e.Course)
                    .ThenInclude(c => c.CourseTags)
                        .ThenInclude(ct => ct.Tag)
                .OrderByDescending(e => e.EnrolledAt)
                .Select(e => new
                {
                    Enrollment = e,
                    ModulesCount = e.Course.Modules.Count
                })
                .FirstOrDefaultAsync();

            if (enrollment is null)
                return NotFound();

            return Ok(new StudentEnrollmentDto
            {
                EnrollmentId = enrollment.Enrollment.Id,
                Status = enrollment.Enrollment.Status,
                EnrolledAt = enrollment.Enrollment.EnrolledAt,
                CompletedAt = enrollment.Enrollment.CompletedAt,
                ProgressPercent = enrollment.Enrollment.ProgressPercent,
                Course = enrollment.Enrollment.Course.ToDto(enrollment.ModulesCount)
            });
        }

        [HttpPost("request")]
        [Authorize]
        public async Task<IActionResult> RequestEnrollment([FromBody] EnrollmentCreateDto dto)
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(idClaim) || !Guid.TryParse(idClaim, out var userId))
                return Unauthorized();

            try
            {
                await _enrollmentService.RequestEnrollment(userId, dto.CourseId);
                return Accepted();
            }
            catch (InvalidOperationException exception)
            {
                return BadRequest(exception.Message);
            }
        }
    }
}

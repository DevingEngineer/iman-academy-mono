using System;
using System.Threading.Tasks;
using ImanAcademy.Dto;
using ImanAcademy.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ImanAcademy.Controllers.CourseManage.CourseManageAdminsOnly
{
    [ApiController]
    [Route("api/admin/enrollments")]
    [Authorize]
    //[Authorize(Roles = "Admin")]
    [Tags("CourseManageAdminsOnly")]
    public class EnrollmentsAdminController : ControllerBase
    {
        private readonly IEnrollmentService _enrollmentService;

        public EnrollmentsAdminController(IEnrollmentService enrollmentService)
        {
            _enrollmentService = enrollmentService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllEnrollments()
        {
            var enrollments = await _enrollmentService.GetAllEnrollments();
            return Ok(enrollments);
        }

        [HttpPost("enroll")]
        public async Task<IActionResult> EnrollStudents([FromBody] EnrollmentAdminActionDto dto)
        {
            if (dto.StudentIds == null || dto.StudentIds.Count == 0)
                return BadRequest("No student ids provided");

            await _enrollmentService.EnrollStudents(dto.StudentIds, dto.CourseId);
            return Ok();
        }

        [HttpPost("{id:guid}/approve")]
        public async Task<IActionResult> ApproveRequest(Guid id)
        {
            await _enrollmentService.ApproveRequest(id);
            return Ok();
        }
    }
}

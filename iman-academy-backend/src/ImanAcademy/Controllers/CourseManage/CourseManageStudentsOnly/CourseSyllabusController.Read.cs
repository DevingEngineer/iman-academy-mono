using ImanAcademy.DTOs;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.AspNetCore.Mvc;

namespace ImanAcademy.Controllers.CourseManage;

public partial class CourseSyllabusController
{
    [HttpGet("{courseIdOrSlug}")]
    [Tags("CourseManageStudentsOnly")]
    public async Task<ActionResult<SyllabusTreeDto>> GetTree(string courseIdOrSlug, CancellationToken ct)
    {
        var course = Guid.TryParse(courseIdOrSlug, out var courseId)
            ? await LoadCourseWithTreeAsync(courseId, asTracking: false, ct)
            : await LoadCourseWithTreeBySlugAsync(courseIdOrSlug, asTracking: false, ct);

        if (course is null)
            return NotFound();

        return Ok(BuildTreeDto(course));
    }
}

using ImanAcademy.DTOs;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.AspNetCore.Mvc;

namespace ImanAcademy.Controllers.CourseManage;

public partial class CourseSyllabusController
{
    [HttpGet("{courseId:guid}")]
    [Tags("CourseManageStudentsOnly")]
    public async Task<ActionResult<SyllabusTreeDto>> GetTree(Guid courseId, CancellationToken ct)
    {
        var course = await LoadCourseWithTreeAsync(courseId, asTracking: false, ct);
        if (course is null)
            return NotFound();

        return Ok(BuildTreeDto(course));
    }
}

using ImanAcademy.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace ImanAcademy.Controllers.CourseManage;

public partial class CourseSyllabusController
{
    [HttpGet("{courseId:guid}")]
    public async Task<ActionResult<SyllabusTreeDto>> GetTree(Guid courseId, CancellationToken ct)
    {
        var course = await LoadCourseWithTreeAsync(courseId, asTracking: false, ct);
        if (course is null)
            return NotFound();

        return Ok(BuildTreeDto(course));
    }
}

using ImanAcademy.DTOs;
using ImanAcademy.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ImanAcademy.Controllers.CourseManage;

[Route("api/courses/syllabus")]
[ApiController]
public partial class CourseSyllabusController : ControllerBase
{
    private readonly ImanAcademyContext _context;
    private readonly ILogger<CourseSyllabusController> _logger;

    public CourseSyllabusController(ImanAcademyContext context, ILogger<CourseSyllabusController> logger)
    {
        _context = context;
        _logger = logger;
    }

    private async Task<Course?> LoadCourseWithTreeAsync(Guid courseId, bool asTracking, CancellationToken ct)
    {
        IQueryable<Course> query = _context.Courses.Include(c => c.Modules).ThenInclude(m => m.SubModules);

        if (!asTracking)
            query = query.AsNoTracking();

        return await query.FirstOrDefaultAsync(c => c.Id == courseId, ct);
    }

    private static SyllabusTreeDto BuildTreeDto(Course course) => new()
    {
        CourseId = course.Id,
        CourseName = course.Title,
        Modules = course.Modules
            .OrderBy(m => m.Order)
            .Select(m => new SyllabusModuleNodeDto
            {
                ModuleId = m.Id,
                CourseId = m.CourseId,
                ModuleName = m.Title,
                Order = m.Order,
                SubModules = m.SubModules
                    .OrderBy(sm => sm.Order)
                    .Select(sm => new SyllabusSubModuleNodeDto
                    {
                        SubModuleId = sm.Id,
                        ModuleId = sm.ModuleId,
                        SubModuleName = sm.Title,
                        Order = sm.Order,
                    })
                    .ToList(),
            })
            .ToList(),
    };
}

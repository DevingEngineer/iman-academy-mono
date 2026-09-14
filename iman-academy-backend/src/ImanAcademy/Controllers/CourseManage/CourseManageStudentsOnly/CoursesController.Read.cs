using ImanAcademy.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ImanAcademy.Controllers.CourseManage;

public partial class CoursesController
{
    [HttpGet]
    public async Task<ActionResult<List<CourseDto>>> GetAll()
    {
        var courses = await _context.Courses
            .Include(c => c.CourseTags).ThenInclude(ct => ct.Tag)
            .OrderBy(c => c.Title)
            .Select(c => new { Course = c, ModulesCount = c.Modules.Count })
            .ToListAsync();

        return Ok(courses.Select(c => c.Course.ToDto(c.ModulesCount)).ToList());
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CourseDto>> GetById(Guid id)
    {
        var course = await _context.Courses
            .Include(c => c.CourseTags).ThenInclude(ct => ct.Tag)
            .Select(c => new { Course = c, ModulesCount = c.Modules.Count })
            .FirstOrDefaultAsync(c => c.Course.Id == id);

        if (course is null) return NotFound();
        return Ok(course.Course.ToDto(course.ModulesCount));
    }

    [HttpGet("{courseId:guid}/modules")]
    public async Task<ActionResult<List<ModuleDto>>> GetModules(Guid courseId)
    {
        if (!await _context.Courses.AnyAsync(c => c.Id == courseId)) return NotFound();

        var modules = await _context.Modules
            .Where(m => m.CourseId == courseId)
            .OrderBy(m => m.Order)
            .ToListAsync();

        return Ok(modules.Select(m => m.ToDto()).ToList());
    }
}

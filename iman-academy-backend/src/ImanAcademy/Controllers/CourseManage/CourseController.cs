using ImanAcademy.DTOs;
using ImanAcademy.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ImanAcademy.Controllers.CourseManage;


[ApiController]
[Route("api/courses")]
public class CoursesController : ControllerBase
{
    private readonly ImanAcademyContext _context;

    public CoursesController(ImanAcademyContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<CourseDto>>> GetAll()
    {
        var courses = await _context.Courses
            .Include(c => c.CourseTags).ThenInclude(ct => ct.Tag)
            .OrderBy(c => c.Title)
            .Select(c => new
            {
                Course = c,
                ModulesCount = c.Modules.Count
            })
            .ToListAsync();

        return Ok(courses.Select(c => c.Course.ToDto(c.ModulesCount)).ToList());
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CourseDto>> GetById(Guid id)
    {
        var course = await _context.Courses
            .Include(c => c.CourseTags).ThenInclude(ct => ct.Tag)
            .Select(c => new
            {
                Course = c,
                ModulesCount = c.Modules.Count
            })
            .FirstOrDefaultAsync(c => c.Course.Id == id);

        if (course is null) return NotFound();
        return Ok(course.Course.ToDto(course.ModulesCount));
    }

    [HttpPost]
    public async Task<ActionResult<CourseDto>> Create(CreateCourseDto dto)
    {
        var course = new Course
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Slug = dto.Slug,
            Description = dto.Description,
            ThumbnailUrl = dto.ThumbnailUrl,
            Level = dto.Level,
            Language = dto.Language,
            Price = dto.Price,
            Currency = dto.Currency,
            Status = dto.Status ?? ContentStatus.Draft,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        await AttachTagsAsync(course, dto.Tags);

        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = course.Id }, course.ToDto(0));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<CourseDto>> Update(Guid id, UpdateCourseDto dto)
    {
        var courseWithModulesCount = await _context.Courses
            .Include(c => c.CourseTags).ThenInclude(ct => ct.Tag)
            .Select(c => new
            {
                Course = c,
                ModulesCount = c.Modules.Count
            })
            .FirstOrDefaultAsync(c => c.Course.Id == id);

        var course = courseWithModulesCount?.Course;


        if (course is null) return NotFound();

        course.Title = dto.Title;
        course.Slug = dto.Slug;
        course.Description = dto.Description;
        course.ThumbnailUrl = dto.ThumbnailUrl;
        course.Level = dto.Level;
        course.Language = dto.Language;
        course.Price = dto.Price;
        course.Currency = dto.Currency;
        course.Status = dto.Status ?? ContentStatus.Draft;
        course.UpdatedAt = DateTime.UtcNow;

        course.CourseTags.Clear();
        await AttachTagsAsync(course, dto.Tags);

        await _context.SaveChangesAsync();
        return Ok(course.ToDto(courseWithModulesCount.ModulesCount));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var course = await _context.Courses.FindAsync(id);
        if (course is null) return NotFound();

        _context.Courses.Remove(course);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // ---------- Modules nested under a course ----------

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

    [HttpPost("{courseId:guid}/modules")]
    public async Task<ActionResult<ModuleDto>> CreateModule(Guid courseId, CreateModuleDto dto)
    {
        if (!await _context.Courses.AnyAsync(c => c.Id == courseId)) return NotFound();

        var module = new Module
        {
            Id = Guid.NewGuid(),
            CourseId = courseId,
            Title = dto.Title,
            Description = dto.Description,
            Order = dto.Order,
            EstimatedDurationMinutes = dto.EstimatedDurationMinutes,
            Status = dto.Status,
        };

        _context.Modules.Add(module);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(ModulesController.GetById), "Modules", new { id = module.Id }, module.ToDto());
    }

    // Resolves tag names to existing Tag rows (case-insensitively), creating
    // any that don't exist yet, and links them to the course.
    private async Task AttachTagsAsync(Course course, List<string>? tagNames)
    {
        if (tagNames is null) return;

        var distinctNames = tagNames
            .Select(t => t.Trim())
            .Where(t => t.Length > 0)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        if (distinctNames.Count == 0) return;

        var existingTags = await _context.Tags
            .Where(t => distinctNames.Contains(t.Name))
            .ToListAsync();

        foreach (var name in distinctNames)
        {
            var tag = existingTags.FirstOrDefault(t => t.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
            if (tag is null)
            {
                tag = new Tag { Id = Guid.NewGuid(), Name = name };
                _context.Tags.Add(tag);
                existingTags.Add(tag); // guards against duplicate names within the same request
            }

            course.CourseTags.Add(new CourseTag { Course = course, Tag = tag });
        }
    }
}
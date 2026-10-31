using ImanAcademy.DTOs;
using ImanAcademy.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.OpenApi;

namespace ImanAcademy.Controllers.CourseManage;

public partial class CoursesController
{
    [HttpPost]
    [Tags("CourseManageAdminsOnly")]
    public async Task<ActionResult<CourseDto>> Create(CreateCourseDto dto)
    {
        var course = new Course { Id = Guid.NewGuid(), Title = dto.Title, Slug = dto.Slug, Description = dto.Description, ThumbnailUrl = dto.ThumbnailUrl, Level = dto.Level, Language = dto.Language, Price = dto.Price, Currency = dto.Currency, Status = dto.Status ?? ContentStatus.Draft, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
        await AttachTagsAsync(course, dto.Tags);
        _context.Courses.Add(course);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = course.Id }, course.ToDto(0));
    }

    [HttpPut("{id:guid}")]
    [Tags("CourseManageAdminsOnly")]
    public async Task<ActionResult<CourseDto>> Update(Guid id, UpdateCourseDto dto)
    {
        var courseWithModulesCount = await _context.Courses.Include(c => c.CourseTags).ThenInclude(ct => ct.Tag).Select(c => new { Course = c, ModulesCount = c.Modules.Count }).FirstOrDefaultAsync(c => c.Course.Id == id);
        var course = courseWithModulesCount?.Course;
        if (course is null) return NotFound();
        course.Title = dto.Title; course.Slug = dto.Slug; course.Description = dto.Description; course.ThumbnailUrl = dto.ThumbnailUrl; course.Level = dto.Level; course.Language = dto.Language; course.Price = dto.Price; course.Currency = dto.Currency; course.Status = dto.Status ?? ContentStatus.Draft; course.UpdatedAt = DateTime.UtcNow;
        course.CourseTags.Clear();
        await AttachTagsAsync(course, dto.Tags);
        await _context.SaveChangesAsync();
        return Ok(course.ToDto(courseWithModulesCount.ModulesCount));
    }

    [HttpDelete("{id:guid}")]
    [Tags("CourseManageAdminsOnly")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var course = await _context.Courses.FindAsync(id);
        if (course is null) return NotFound();
        _context.Courses.Remove(course);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("{courseId:guid}/modules")]
    [Tags("CourseManageAdminsOnly")]
    public async Task<ActionResult<ModuleDto>> CreateModule(Guid courseId, CreateModuleDto dto)
    {
        if (!await _context.Courses.AnyAsync(c => c.Id == courseId)) return NotFound();
        var module = new Module { Id = Guid.NewGuid(), CourseId = courseId, Title = dto.Title, Description = dto.Description, Order = dto.Order, EstimatedDurationMinutes = dto.EstimatedDurationMinutes, Status = dto.Status };
        _context.Modules.Add(module);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(ModulesController.GetById), "Modules", new { id = module.Id }, module.ToDto());
    }

    private async Task AttachTagsAsync(Course course, List<string>? tagNames)
    {
        if (tagNames is null) return;
        var distinctNames = tagNames.Select(t => t.Trim()).Where(t => t.Length > 0).Distinct(StringComparer.OrdinalIgnoreCase).ToList();
        if (distinctNames.Count == 0) return;
        var existingTags = await _context.Tags.Where(t => distinctNames.Contains(t.Name)).ToListAsync();
        foreach (var name in distinctNames)
        {
            var tag = existingTags.FirstOrDefault(t => t.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
            if (tag is null) { tag = new Tag { Id = Guid.NewGuid(), Name = name }; _context.Tags.Add(tag); existingTags.Add(tag); }
            course.CourseTags.Add(new CourseTag { Course = course, Tag = tag });
        }
    }
}

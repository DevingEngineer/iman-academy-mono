using ImanAcademy.DTOs;
using ImanAcademy.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ImanAcademy.Controllers.CourseManage;

[Route("api/courses/syllabus")]
[ApiController]
public class CourseSyllabusController : ControllerBase
{
    private readonly ImanAcademyContext _context;
    private readonly ILogger<CourseSyllabusController> _logger;

    public CourseSyllabusController(ImanAcademyContext context, ILogger<CourseSyllabusController> logger)
    {
        _context = context;
        _logger = logger;
    }
    // ---------- 1. READ ----------

    // GET api/syllabus/{courseId}
    [HttpGet("{courseId:guid}")]
    public async Task<ActionResult<SyllabusTreeDto>> GetTree(Guid courseId, CancellationToken ct)
    {
        var course = await LoadCourseWithTreeAsync(courseId, asTracking: false, ct);
        if (course is null)
            return NotFound();

        return Ok(BuildTreeDto(course));
    }

    // ---------- 2. SYNC (create/rename/delete/reorder/re-parent) ----------

    // PUT api/syllabus/{courseId}/sync
    [HttpPut("{courseId:guid}/sync")]
    public async Task<ActionResult<SyllabusTreeDto>> Sync(
        Guid courseId, [FromBody] SyllabusTreeDto dto, CancellationToken ct)
    {
        var moduleIds = dto.Modules.Where(m => m.ModuleId.HasValue).Select(m => m.ModuleId!.Value).ToList();
        if (moduleIds.Distinct().Count() != moduleIds.Count)
            return BadRequest("Payload contains a duplicate ModuleId.");

        var subModuleIds = dto.Modules
            .SelectMany(m => m.SubModules)
            .Where(sm => sm.SubModuleId.HasValue)
            .Select(sm => sm.SubModuleId!.Value)
            .ToList();
        if (subModuleIds.Distinct().Count() != subModuleIds.Count)
            return BadRequest("Payload contains a duplicate SubModuleId.");

        await using var tx = await _context.Database.BeginTransactionAsync(ct);

        var course = await LoadCourseWithTreeAsync(courseId, asTracking: true, ct);
        if (course is null)
            return NotFound();

        if (!string.IsNullOrWhiteSpace(dto.CourseName) && dto.CourseName != course.Title)
        {
            course.Title = dto.CourseName;
            course.UpdatedAt = DateTime.UtcNow;
        }

        // Only Ids that actually belong to this course count as "existing" -
        // anything else (missing, or from a different course) is created
        // fresh, so a client can't use this to reach into another course.
        var existingModules = course.Modules.ToDictionary(m => m.Id);
        var existingSubModules = course.Modules.SelectMany(m => m.SubModules).ToDictionary(sm => sm.Id);

        var keptModuleIds = new HashSet<Guid>();
        var keptSubModuleIds = new HashSet<Guid>();

        for (var mi = 0; mi < dto.Modules.Count; mi++)
        {
            var mDto = dto.Modules[mi];
            Module module;

            if (mDto.ModuleId.HasValue && existingModules.TryGetValue(mDto.ModuleId.Value, out var existingModule))
            {
                module = existingModule;
                module.Title = mDto.ModuleName;
                module.Order = mi;
            }
            else
            {
                // Note: mDto.CourseId is ignored - the route's courseId owns this.
                module = new Module
                {
                    Id = Guid.NewGuid(),
                    CourseId = courseId,
                    Title = mDto.ModuleName,
                    Order = mi,
                    Status = ContentStatus.Draft,
                };
                _context.Modules.Add(module);
            }

            keptModuleIds.Add(module.Id);

            for (var si = 0; si < mDto.SubModules.Count; si++)
            {
                var sDto = mDto.SubModules[si];
                SubModule subModule;

                if (sDto.SubModuleId.HasValue &&
                    existingSubModules.TryGetValue(sDto.SubModuleId.Value, out var existingSubModule))
                {
                    subModule = existingSubModule;
                    subModule.Title = sDto.SubModuleName;
                    subModule.Order = si;
                    subModule.ModuleId = module.Id; // re-parents if it moved to a different module in the payload
                }
                else
                {
                    // Note: sDto.ModuleId is ignored - `module.Id` above (this
                    // submodule's actual position in the payload tree) owns this.
                    subModule = new SubModule
                    {
                        Id = Guid.NewGuid(),
                        ModuleId = module.Id,
                        Title = sDto.SubModuleName,
                        Order = si,
                    };
                    _context.SubModules.Add(subModule);
                }

                keptSubModuleIds.Add(subModule.Id);
            }
        }

        // Anything that existed before but is missing from the payload = deleted.
        var modulesToRemove = existingModules.Values.Where(m => !keptModuleIds.Contains(m.Id)).ToList();
        var subModulesToRemove = existingSubModules.Values.Where(sm => !keptSubModuleIds.Contains(sm.Id)).ToList();

        _context.SubModules.RemoveRange(subModulesToRemove);
        _context.Modules.RemoveRange(modulesToRemove); // cascade handles any of its submodules not already listed above

        await _context.SaveChangesAsync(ct);
        await tx.CommitAsync(ct);

        var refreshed = await LoadCourseWithTreeAsync(courseId, asTracking: false, ct);
        return Ok(BuildTreeDto(refreshed!));
    }

    // ---------- helpers ----------

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

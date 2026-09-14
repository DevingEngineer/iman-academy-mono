using ImanAcademy.DTOs;
using ImanAcademy.Models;
using Microsoft.AspNetCore.Mvc;

namespace ImanAcademy.Controllers.CourseManage;

public partial class CourseSyllabusController
{
    [HttpPut("{courseId:guid}/sync")]
    public async Task<ActionResult<SyllabusTreeDto>> Sync(Guid courseId, [FromBody] SyllabusTreeDto dto, CancellationToken ct)
    {
        var moduleIds = dto.Modules.Where(m => m.ModuleId.HasValue).Select(m => m.ModuleId!.Value).ToList();
        if (moduleIds.Distinct().Count() != moduleIds.Count) return BadRequest("Payload contains a duplicate ModuleId.");
        var subModuleIds = dto.Modules.SelectMany(m => m.SubModules).Where(sm => sm.SubModuleId.HasValue).Select(sm => sm.SubModuleId!.Value).ToList();
        if (subModuleIds.Distinct().Count() != subModuleIds.Count) return BadRequest("Payload contains a duplicate SubModuleId.");
        await using var tx = await _context.Database.BeginTransactionAsync(ct);
        var course = await LoadCourseWithTreeAsync(courseId, asTracking: true, ct);
        if (course is null) return NotFound();
        if (!string.IsNullOrWhiteSpace(dto.CourseName) && dto.CourseName != course.Title) { course.Title = dto.CourseName; course.UpdatedAt = DateTime.UtcNow; }
        var existingModules = course.Modules.ToDictionary(m => m.Id);
        var existingSubModules = course.Modules.SelectMany(m => m.SubModules).ToDictionary(sm => sm.Id);
        var keptModuleIds = new HashSet<Guid>();
        var keptSubModuleIds = new HashSet<Guid>();
        for (var mi = 0; mi < dto.Modules.Count; mi++)
        {
            var mDto = dto.Modules[mi];
            Module module;
            if (mDto.ModuleId.HasValue && existingModules.TryGetValue(mDto.ModuleId.Value, out var existingModule)) { module = existingModule; module.Title = mDto.ModuleName; module.Order = mi; }
            else { module = new Module { Id = Guid.NewGuid(), CourseId = courseId, Title = mDto.ModuleName, Order = mi, Status = ContentStatus.Draft }; _context.Modules.Add(module); }
            keptModuleIds.Add(module.Id);
            for (var si = 0; si < mDto.SubModules.Count; si++)
            {
                var sDto = mDto.SubModules[si];
                SubModule subModule;
                if (sDto.SubModuleId.HasValue && existingSubModules.TryGetValue(sDto.SubModuleId.Value, out var existingSubModule)) { subModule = existingSubModule; subModule.Title = sDto.SubModuleName; subModule.Order = si; subModule.ModuleId = module.Id; }
                else { subModule = new SubModule { Id = Guid.NewGuid(), ModuleId = module.Id, Title = sDto.SubModuleName, Order = si }; _context.SubModules.Add(subModule); }
                keptSubModuleIds.Add(subModule.Id);
            }
        }
        _context.SubModules.RemoveRange(existingSubModules.Values.Where(sm => !keptSubModuleIds.Contains(sm.Id)).ToList());
        _context.Modules.RemoveRange(existingModules.Values.Where(m => !keptModuleIds.Contains(m.Id)).ToList());
        await _context.SaveChangesAsync(ct);
        await tx.CommitAsync(ct);
        var refreshed = await LoadCourseWithTreeAsync(courseId, asTracking: false, ct);
        return Ok(BuildTreeDto(refreshed!));
    }
}

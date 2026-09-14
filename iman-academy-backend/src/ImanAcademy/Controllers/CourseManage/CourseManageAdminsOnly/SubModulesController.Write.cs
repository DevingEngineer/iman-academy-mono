using ImanAcademy.DTOs;
using ImanAcademy.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ImanAcademy.Controllers.CourseManage;

public partial class SubModulesController
{
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<SubModuleDto>> Update(Guid id, UpdateSubModuleDto dto)
    {
        var subModule = await _context.SubModules.FindAsync(id);
        if (subModule is null) return NotFound();
        subModule.Title = dto.Title; subModule.Description = dto.Description; subModule.Order = dto.Order; subModule.EstimatedDurationMinutes = dto.EstimatedDurationMinutes;
        await _context.SaveChangesAsync();
        return Ok(subModule.ToDto());
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var subModule = await _context.SubModules.FindAsync(id);
        if (subModule is null) return NotFound();
        _context.SubModules.Remove(subModule);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("{subModuleId:guid}/steps")]
    public async Task<ActionResult<StepDto>> CreateStep(Guid subModuleId, StepUpsertDto dto)
    {
        if (!await _context.SubModules.AnyAsync(sm => sm.Id == subModuleId)) return NotFound();
        var step = dto.ToEntity(subModuleId);
        _context.Add(step);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(StepsController.GetById), "Steps", new { id = step.Id }, step.ToDto());
    }
}

using ImanAcademy.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.OpenApi;

namespace ImanAcademy.Controllers.CourseManage;

public partial class ModulesController
{
    [HttpPut("{id:guid}")]
    [Tags("CourseManageAdminsOnly")]
    public async Task<ActionResult<ModuleDto>> Update(Guid id, UpdateModuleDto dto)
    {
        var module = await _context.Modules.FindAsync(id);
        if (module is null) return NotFound();
        module.Title = dto.Title; module.Description = dto.Description; module.Order = dto.Order; module.EstimatedDurationMinutes = dto.EstimatedDurationMinutes; module.Status = dto.Status;
        await _context.SaveChangesAsync();
        return Ok(module.ToDto());
    }

    [HttpDelete("{id:guid}")]
    [Tags("CourseManageAdminsOnly")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var module = await _context.Modules.FindAsync(id);
        if (module is null) return NotFound();
        _context.Modules.Remove(module);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("{moduleId:guid}/submodules")]
    [Tags("CourseManageAdminsOnly")]
    public async Task<ActionResult<SubModuleDto>> CreateSubModule(Guid moduleId, CreateSubModuleDto dto)
    {
        if (!await _context.Modules.AnyAsync(m => m.Id == moduleId)) return NotFound();
        var subModule = new Models.SubModule { Id = Guid.NewGuid(), ModuleId = moduleId, Title = dto.Title, Description = dto.Description, Order = dto.Order, EstimatedDurationMinutes = dto.EstimatedDurationMinutes };
        _context.SubModules.Add(subModule);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(SubModulesController.GetById), "SubModules", new { id = subModule.Id }, subModule.ToDto());
    }
}

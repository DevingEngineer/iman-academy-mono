using ImanAcademy.DTOs;
using ImanAcademy.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ImanAcademy.Controllers.CourseManage;


[ApiController]
[Route("api/modules")]
public class ModulesController : ControllerBase
{
    private readonly ImanAcademyContext _context;

    public ModulesController(ImanAcademyContext context)
    {
        _context = context;
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ModuleDto>> GetById(Guid id)
    {
        var module = await _context.Modules.FirstOrDefaultAsync(m => m.Id == id);
        if (module is null) return NotFound();
        return Ok(module.ToDto());
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ModuleDto>> Update(Guid id, UpdateModuleDto dto)
    {
        var module = await _context.Modules.FindAsync(id);
        if (module is null) return NotFound();

        module.Title = dto.Title;
        module.Description = dto.Description;
        module.Order = dto.Order;
        module.EstimatedDurationMinutes = dto.EstimatedDurationMinutes;
        module.Status = dto.Status;

        await _context.SaveChangesAsync();
        return Ok(module.ToDto());
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var module = await _context.Modules.FindAsync(id);
        if (module is null) return NotFound();

        _context.Modules.Remove(module);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // ---------- SubModules nested under a module ----------

    [HttpGet("{moduleId:guid}/submodules")]
    public async Task<ActionResult<List<SubModuleDto>>> GetSubModules(Guid moduleId)
    {
        if (!await _context.Modules.AnyAsync(m => m.Id == moduleId)) return NotFound();

        var subModules = await _context.SubModules
            .Where(sm => sm.ModuleId == moduleId)
            .OrderBy(sm => sm.Order)
            .ToListAsync();

        return Ok(subModules.Select(sm => sm.ToDto()).ToList());
    }

    [HttpPost("{moduleId:guid}/submodules")]
    public async Task<ActionResult<SubModuleDto>> CreateSubModule(Guid moduleId, CreateSubModuleDto dto)
    {
        if (!await _context.Modules.AnyAsync(m => m.Id == moduleId)) return NotFound();

        var subModule = new SubModule
        {
            Id = Guid.NewGuid(),
            ModuleId = moduleId,
            Title = dto.Title,
            Description = dto.Description,
            Order = dto.Order,
            EstimatedDurationMinutes = dto.EstimatedDurationMinutes,
        };

        _context.SubModules.Add(subModule);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(SubModulesController.GetById), "SubModules", new { id = subModule.Id }, subModule.ToDto());
    }
}

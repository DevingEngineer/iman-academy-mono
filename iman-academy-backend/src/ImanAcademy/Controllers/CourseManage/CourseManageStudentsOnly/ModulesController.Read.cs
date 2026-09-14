using ImanAcademy.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ImanAcademy.Controllers.CourseManage;

public partial class ModulesController
{
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ModuleDto>> GetById(Guid id)
    {
        var module = await _context.Modules.FirstOrDefaultAsync(m => m.Id == id);
        if (module is null) return NotFound();
        return Ok(module.ToDto());
    }

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
}

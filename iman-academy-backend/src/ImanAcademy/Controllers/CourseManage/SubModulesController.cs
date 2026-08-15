using ImanAcademy.DTOs;
using ImanAcademy.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ImanAcademy.Controllers.CourseManage;

[ApiController]
[Route("api/submodules")]
public class SubModulesController : ControllerBase
{
    private readonly ImanAcademyContext _context;

    public SubModulesController(ImanAcademyContext context)
    {
        _context = context;
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<SubModuleDto>> GetById(Guid id)
    {
        var subModule = await _context.SubModules.Include(sm=>sm.Steps).FirstOrDefaultAsync(sm => sm.Id == id);
        if (subModule is null) return NotFound();
        return Ok(subModule.ToDto());
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<SubModuleDto>> Update(Guid id, UpdateSubModuleDto dto)
    {
        var subModule = await _context.SubModules.FindAsync(id);
        if (subModule is null) return NotFound();

        subModule.Title = dto.Title;
        subModule.Description = dto.Description;
        subModule.Order = dto.Order;
        subModule.EstimatedDurationMinutes = dto.EstimatedDurationMinutes;

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

    // ---------- Steps nested under a submodule ----------

    [HttpGet("{subModuleId:guid}/steps")]
    public async Task<ActionResult<List<StepDto>>> GetSteps(Guid subModuleId)
    {
        if (!await _context.SubModules.AnyAsync(sm => sm.Id == subModuleId)) return NotFound();

        // TPC means there's no single "Steps" table to run one Include-ing
        // query against, so each concrete type (with its own children) is
        // queried separately and merged/sorted in memory.
        var contentSteps = await _context.Set<ContentStep>()
            .Where(s => s.SubModuleId == subModuleId)
            .Include(s => s.Attachments)
            .ToListAsync();

        var videoSteps = await _context.Set<VideoStep>()
            .Where(s => s.SubModuleId == subModuleId)
            .ToListAsync();

        var quizSteps = await _context.Set<QuizStep>()
            .Where(s => s.SubModuleId == subModuleId)
            .Include(s => s.Questions).ThenInclude(q => q.Options)
            .ToListAsync();

        var steps = contentSteps.Cast<Step>()
            .Concat(videoSteps)
            .Concat(quizSteps)
            .OrderBy(s => s.Order)
            .Select(s => s.ToDto())
            .ToList();

        return Ok(steps);
    }

    [HttpPost("{subModuleId:guid}/steps")]
    public async Task<ActionResult<StepDto>> CreateStep(Guid subModuleId, StepUpsertDto dto)
    {
        if (!await _context.SubModules.AnyAsync(sm => sm.Id == subModuleId)) return NotFound();

        var step = dto.ToEntity(subModuleId);
        _context.Add(step); // EF routes this to the right table (ContentSteps/VideoSteps/QuizSteps) from the CLR type
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(StepsController.GetById), "Steps", new { id = step.Id }, step.ToDto());
    }
}

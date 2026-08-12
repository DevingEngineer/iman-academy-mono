using ImanAcademy.DTOs;
using ImanAcademy.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ImanAcademy.Controllers.CourseManage;

[ApiController]
[Route("api/steps")]
public class StepsController : ControllerBase
{
    private readonly ImanAcademyContext _context;

    public StepsController(ImanAcademyContext context)
    {
        _context = context;
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<StepDto>> GetById(Guid id)
    {
        var step = await LoadStepWithDetailsAsync(id, trackChanges: false);
        if (step is null) return NotFound();
        return Ok(step.ToDto());
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<StepDto>> Update(Guid id, StepUpsertDto dto)
    {
        var step = await LoadStepWithDetailsAsync(id, trackChanges: true);
        if (step is null) return NotFound();

        try
        {
            dto.ApplyTo(step);
        }
        catch (InvalidOperationException ex)
        {
            // e.g. PUTing a QuizStepUpsertDto against an existing VideoStep
            return Conflict(new { message = ex.Message });
        }

        await _context.SaveChangesAsync();
        return Ok(step.ToDto());
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var step = await _context.Steps.FirstOrDefaultAsync(s => s.Id == id);
        if (step is null) return NotFound();

        _context.Remove(step); // resolved to the right table via the entity's runtime CLR type
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // Finds which concrete type a step is first (cheap, no children loaded),
    // then re-queries that specific table with the includes it needs. TPC
    // has no shared table to Include children from in a single query.
    private async Task<Step?> LoadStepWithDetailsAsync(Guid id, bool trackChanges)
    {
        var probe = await _context.Steps.AsNoTracking().FirstOrDefaultAsync(s => s.Id == id);
        if (probe is null) return null;

        IQueryable<Step> query = probe switch
        {
            ContentStep => _context.Set<ContentStep>().Include(s => s.Attachments),
            VideoStep => _context.Set<VideoStep>(),
            QuizStep => _context.Set<QuizStep>().Include(s => s.Questions).ThenInclude(q => q.Options),
            _ => throw new NotSupportedException($"Unknown step type '{probe.GetType().Name}'."),
        };

        if (!trackChanges) query = query.AsNoTracking();

        return await query.FirstAsync(s => s.Id == id);
    }
}
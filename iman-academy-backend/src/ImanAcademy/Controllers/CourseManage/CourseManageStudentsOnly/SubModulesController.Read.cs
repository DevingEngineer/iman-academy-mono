using ImanAcademy.DTOs;
using ImanAcademy.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ImanAcademy.Controllers.CourseManage;

public partial class SubModulesController
{
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<SubModuleDto>> GetById(Guid id)
    {
        var subModule = await _context.SubModules.Include(sm => sm.Steps).FirstOrDefaultAsync(sm => sm.Id == id);
        if (subModule is null) return NotFound();
        return Ok(subModule.ToDto());
    }

    [HttpGet("{subModuleId:guid}/steps")]
    public async Task<ActionResult<List<StepDto>>> GetSteps(Guid subModuleId)
    {
        if (!await _context.SubModules.AnyAsync(sm => sm.Id == subModuleId)) return NotFound();

        var contentSteps = await _context.Set<ContentStep>()
            .Where(s => s.SubModuleId == subModuleId).Include(s => s.Attachments).ToListAsync();
        var videoSteps = await _context.Set<VideoStep>()
            .Where(s => s.SubModuleId == subModuleId).ToListAsync();
        var quizSteps = await _context.Set<QuizStep>()
            .Where(s => s.SubModuleId == subModuleId).Include(s => s.Questions).ThenInclude(q => q.Options).ToListAsync();

        var steps = contentSteps.Cast<Step>().Concat(videoSteps).Concat(quizSteps)
            .OrderBy(s => s.Order).Select(s => s.ToDto()).ToList();

        return Ok(steps);
    }
}

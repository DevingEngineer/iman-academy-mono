using ImanAcademy.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ImanAcademy.Controllers.CourseManage;

[ApiController]
[Route("api/steps")]
public partial class StepsController : ControllerBase
{
    private readonly ImanAcademyContext _context;

    public StepsController(ImanAcademyContext context)
    {
        _context = context;
    }

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

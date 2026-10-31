using ImanAcademy.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.OpenApi;

namespace ImanAcademy.Controllers.CourseManage;

public partial class StepsController
{
    [HttpPut("{id:guid}")]
    [Tags("CourseManageAdminsOnly")]
    public async Task<ActionResult<StepDto>> Update(Guid id, StepUpsertDto dto)
    {
        var step = await LoadStepWithDetailsAsync(id, trackChanges: true);
        if (step is null) return NotFound();
        try { dto.ApplyTo(step); }
        catch (InvalidOperationException ex) { return Conflict(new { message = ex.Message }); }
        await _context.SaveChangesAsync();
        return Ok(step.ToDto());
    }

    [HttpDelete("{id:guid}")]
    [Tags("CourseManageAdminsOnly")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var step = await _context.Steps.FirstOrDefaultAsync(s => s.Id == id);
        if (step is null) return NotFound();
        _context.Remove(step);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

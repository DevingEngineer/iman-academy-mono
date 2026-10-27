using ImanAcademy.DTOs;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.AspNetCore.Mvc;

namespace ImanAcademy.Controllers.CourseManage;

public partial class StepsController
{
    [HttpGet("{id:guid}")]
    [Tags("CourseManageStudentsOnly")]
    public async Task<ActionResult<StepDto>> GetById(Guid id)
    {
        var step = await LoadStepWithDetailsAsync(id, trackChanges: false);
        if (step is null) return NotFound();
        return Ok(step.ToDto());
    }
}

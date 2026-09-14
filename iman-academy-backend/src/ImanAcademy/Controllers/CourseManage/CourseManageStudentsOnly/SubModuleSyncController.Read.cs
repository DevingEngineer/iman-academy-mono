using ImanAcademy.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace ImanAcademy.Controllers.CourseManage;

public partial class SubModuleSyncController
{
    [HttpGet("{subModuleId:guid}")]
    public async Task<ActionResult<List<SubModuleDto>>> GetById(Guid subModuleId, CancellationToken ct)
    {
        return Ok(await _sync.GetBySubModuleAsync(subModuleId, ct));
    }
}

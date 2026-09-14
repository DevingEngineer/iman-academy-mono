using ImanAcademy.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OpenApi;

namespace ImanAcademy.Controllers.CourseManage;

public partial class SubModuleSyncController
{
    [HttpGet("{subModuleId:guid}")]
    [Tags("CourseManageStudentsOnly")]
    public async Task<ActionResult<List<SubModuleDto>>> GetById(Guid subModuleId, CancellationToken ct)
    {
        return Ok(await _sync.GetBySubModuleAsync(subModuleId, ct));
    }
}

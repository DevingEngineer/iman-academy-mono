using ImanAcademy.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OpenApi;

namespace ImanAcademy.Controllers.CourseManage;

public partial class SubModuleSyncController
{
    [HttpPut("sync")]
    [Tags("CourseManageAdminsOnly")]
    public async Task<ActionResult<SubModuleDto>> Sync([FromBody] SubModuleDto dto, CancellationToken ct)
    {
        try { return Ok(await _sync.SyncAsync(dto, ct)); }
        catch (Exception ex) { return NotFound(ex.Message); }
    }
}

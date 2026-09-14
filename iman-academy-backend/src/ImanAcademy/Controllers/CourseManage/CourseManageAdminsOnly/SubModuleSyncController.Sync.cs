using ImanAcademy.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace ImanAcademy.Controllers.CourseManage;

public partial class SubModuleSyncController
{
    [HttpPut("sync")]
    public async Task<ActionResult<SubModuleDto>> Sync([FromBody] SubModuleDto dto, CancellationToken ct)
    {
        try { return Ok(await _sync.SyncAsync(dto, ct)); }
        catch (Exception ex) { return NotFound(ex.Message); }
    }
}

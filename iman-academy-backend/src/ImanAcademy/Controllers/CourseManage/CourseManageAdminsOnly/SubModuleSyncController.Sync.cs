using ImanAcademy.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OpenApi;

namespace ImanAcademy.Controllers.CourseManage;

[ApiController]
[Route("api/submodules-sync")]
public partial class SubModuleSyncController : ControllerBase
{
    private readonly SubModuleSyncService _sync;

    public SubModuleSyncController(SubModuleSyncService sync) => _sync = sync;

    [HttpPut("sync")]
    [Tags("CourseManageAdminsOnly")]
    public async Task<ActionResult<SubModuleDto>> Sync([FromBody] SubModuleDto dto, CancellationToken ct)
    {
        try { return Ok(await _sync.SyncAsync(dto, ct)); }
        catch (KeyNotFoundException ex) { return NotFound(ex.Message); }
        catch (ArgumentException ex) { return BadRequest(ex.Message); }
    }
}

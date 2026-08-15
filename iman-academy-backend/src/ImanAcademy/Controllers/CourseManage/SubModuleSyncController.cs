using ImanAcademy.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace ImanAcademy.Controllers.CourseManage;

[ApiController]
[Route("api/submodules-sync")]

public class SubModuleSyncController : ControllerBase
{
    private readonly SubModuleSyncService _sync;
    public SubModuleSyncController(SubModuleSyncService sync) => _sync = sync;

    [HttpGet("{subModuleId:guid}")]
    public async Task<ActionResult<List<SubModuleDto>>> GetById(Guid subModuleId, CancellationToken ct)
    {
        return Ok(await _sync.GetBySubModuleAsync(subModuleId, ct));
    }
    [HttpPut("sync")]
    public async Task<ActionResult<SubModuleDto>> Sync([FromBody] SubModuleDto dto, CancellationToken ct)
    {
        try
        {
            return Ok(await _sync.SyncAsync(dto, ct));
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }
}

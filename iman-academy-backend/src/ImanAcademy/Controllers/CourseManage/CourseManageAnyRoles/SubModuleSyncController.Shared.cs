using Microsoft.AspNetCore.Mvc;
using ImanAcademy.Services;

namespace ImanAcademy.Controllers.CourseManage;

[ApiController]
[Route("api/submodules-sync")]
public partial class SubModuleSyncController : ControllerBase
{
    private readonly SubModuleSyncService _sync;

    public SubModuleSyncController(SubModuleSyncService sync) => _sync = sync;
}

using ImanAcademy.Models;
using Microsoft.AspNetCore.Mvc;

namespace ImanAcademy.Controllers.CourseManage;

[ApiController]
[Route("api/submodules")]
public partial class SubModulesController : ControllerBase
{
    private readonly ImanAcademyContext _context;

    public SubModulesController(ImanAcademyContext context)
    {
        _context = context;
    }
}

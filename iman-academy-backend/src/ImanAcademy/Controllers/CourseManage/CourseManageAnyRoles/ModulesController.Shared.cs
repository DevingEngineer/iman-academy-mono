using ImanAcademy.Models;
using Microsoft.AspNetCore.Mvc;

namespace ImanAcademy.Controllers.CourseManage;

[ApiController]
[Route("api/modules")]
public partial class ModulesController : ControllerBase
{
    private readonly ImanAcademyContext _context;

    public ModulesController(ImanAcademyContext context)
    {
        _context = context;
    }
}

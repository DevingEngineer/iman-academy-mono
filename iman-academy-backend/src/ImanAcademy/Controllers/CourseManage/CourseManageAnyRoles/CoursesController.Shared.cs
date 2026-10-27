using ImanAcademy.Models;
using Microsoft.AspNetCore.Mvc;

namespace ImanAcademy.Controllers.CourseManage;

[ApiController]
[Route("api/courses")]
public partial class CoursesController : ControllerBase
{
    private readonly ImanAcademyContext _context;

    public CoursesController(ImanAcademyContext context)
    {
        _context = context;
    }
}

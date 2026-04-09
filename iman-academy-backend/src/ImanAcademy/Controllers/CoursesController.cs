using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ImanAcademy.Models;
using ImanAcademy.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ImanAcademy.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoursesController : ControllerBase
    {
        private readonly ImanAcademyContext _db;

        public CoursesController(ImanAcademyContext db) => _db = db;

        /// <summary>
        /// Get all courses.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ImanAcademy.DTOs.CourseDto>>> Get()
        {
            var items = await _db.Courses.Include(c => c.Category).AsNoTracking().ToListAsync();
            return Ok(items.Select(c => c.ToDto()));
        }

        /// <summary>
        /// Get a course by id.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ImanAcademy.DTOs.CourseDto>> Get(int id)
        {
            var item = await _db.Courses.Include(c => c.Category).FirstOrDefaultAsync(c => c.CourseId == id);
            if (item == null) return NotFound();
            return Ok(item.ToDto());
        }

        /// <summary>
        /// Create a new course.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ImanAcademy.DTOs.CourseDto>> Post([FromBody] ImanAcademy.DTOs.CourseDto dto)
        {
            var model = dto.FromDto();
            _db.Courses.Add(model);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = model.CourseId }, model.ToDto());
        }

        /// <summary>
        /// Update an existing course.
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] ImanAcademy.DTOs.CourseDto dto)
        {
            if (id != dto.CourseId) return BadRequest();
            var existing = await _db.Courses.FindAsync(id);
            if (existing == null) return NotFound();
            existing.Title = dto.Title;
            existing.Description = dto.Description;
            existing.Price = dto.Price;
            existing.DifficultyLevel = dto.DifficultyLevel;
            existing.CategoryId = dto.CategoryId;
            existing.InstructorId = dto.InstructorId;
            try
            {
                await _db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _db.Courses.AnyAsync(c => c.CourseId == id)) return NotFound();
                throw;
            }
            return NoContent();
        }

        /// <summary>
        /// Delete a course.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.Courses.FindAsync(id);
            if (item == null) return NotFound();
            _db.Courses.Remove(item);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}

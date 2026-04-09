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
    public class LessonsController : ControllerBase
    {
        private readonly ImanAcademyContext _db;

        public LessonsController(ImanAcademyContext db)
        {
            _db = db;
        }

        /// <summary>
        /// Get lessons for a course.
        /// </summary>
        [HttpGet("course/{courseId}")]
        public async Task<ActionResult<IEnumerable<ImanAcademy.DTOs.LessonDto>>> GetByCourse(int courseId)
        {
            var items = await _db.Lessons.Where(l => l.CourseId == courseId).AsNoTracking().ToListAsync();
            return Ok(items.Select(l => l.ToDto()));
        }

        /// <summary>
        /// Get a lesson by id.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ImanAcademy.DTOs.LessonDto>> Get(int id)
        {
            var item = await _db.Lessons.FindAsync(id);
            if (item == null) return NotFound();
            return Ok(item.ToDto());
        }

        /// <summary>
        /// Create a lesson.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ImanAcademy.DTOs.LessonDto>> Post([FromBody] ImanAcademy.DTOs.LessonDto dto)
        {
            var model = dto.FromDto();
            _db.Lessons.Add(model);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = model.LessonId }, model.ToDto());
        }

        /// <summary>
        /// Update a lesson.
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] ImanAcademy.DTOs.LessonDto dto)
        {
            if (id != dto.LessonId) return BadRequest();
            var existing = await _db.Lessons.FindAsync(id);
            if (existing == null) return NotFound();
            existing.Title = dto.Title;
            existing.ContentUrl = dto.ContentUrl;
            existing.OrderIndex = dto.OrderIndex;
            existing.IsPreview = dto.IsPreview;
            existing.CourseId = dto.CourseId;
            try
            {
                await _db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _db.Lessons.AnyAsync(c => c.LessonId == id)) return NotFound();
                throw;
            }
            return NoContent();
        }

        /// <summary>
        /// Delete a lesson.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.Lessons.FindAsync(id);
            if (item == null) return NotFound();
            _db.Lessons.Remove(item);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}

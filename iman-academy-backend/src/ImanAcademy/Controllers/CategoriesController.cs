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
    public class CategoriesController : ControllerBase
    {
        private readonly ImanAcademyContext _db;

        public CategoriesController(ImanAcademyContext db) => _db = db;

        /// <summary>
        /// Get all categories.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ImanAcademy.DTOs.CategoryDto>>> Get()
        {
            var items = await _db.Categories.AsNoTracking().ToListAsync();
            return Ok(items.Select(c => c.ToDto()));
        }

        /// <summary>
        /// Get a category by id.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ImanAcademy.DTOs.CategoryDto>> Get(int id)
        {
            var item = await _db.Categories.FindAsync(id);
            if (item == null) return NotFound();
            return Ok(item.ToDto());
        }

        /// <summary>
        /// Create a new category.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ImanAcademy.DTOs.CategoryDto>> Post([FromBody] CategoryDto dto)
        {
            var model = dto.FromDto();
            _db.Categories.Add(model);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = model.CategoryId }, model.ToDto());
        }

        /// <summary>
        /// Update an existing category.
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] CategoryDto dto)
        {
            if (id != dto.CategoryId) return BadRequest();
            var existing = await _db.Categories.FindAsync(id);
            if (existing == null) return NotFound();
            // map allowed fields
            existing.Name = dto.Name;
            existing.Description = dto.Description;
            try
            {
                await _db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _db.Categories.AnyAsync(c => c.CategoryId == id)) return NotFound();
                throw;
            }
            return NoContent();
        }

        /// <summary>
        /// Delete a category.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.Categories.FindAsync(id);
            if (item == null) return NotFound();
            _db.Categories.Remove(item);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}

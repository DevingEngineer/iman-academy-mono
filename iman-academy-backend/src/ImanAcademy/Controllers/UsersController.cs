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
    public class UsersController : ControllerBase
    {
        private readonly ImanAcademyContext _db;

        public UsersController(ImanAcademyContext db) => _db = db;

        /// <summary>
        /// Get all users.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ImanAcademy.DTOs.UserDto>>> Get()
        {
            var items = await _db.Users.AsNoTracking().ToListAsync();
            return Ok(items.Select(u => u.ToDto()));
        }

        /// <summary>
        /// Get a user by id.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ImanAcademy.DTOs.UserDto>> Get(int id)
        {
            var item = await _db.Users.FindAsync(id);
            if (item == null) return NotFound();
            return Ok(item.ToDto());
        }

        /// <summary>
        /// Create a new user.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ImanAcademy.DTOs.UserDto>> Post([FromBody] ImanAcademy.DTOs.UserDto dto)
        {
            var model = dto.FromDto();
            // PasswordHash must be set by caller separately (e.g. registration flow). Using empty string for now.
            model.PasswordHash = string.Empty;
            _db.Users.Add(model);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = model.UserId }, model.ToDto());
        }

        /// <summary>
        /// Update an existing user.
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] ImanAcademy.DTOs.UserDto dto)
        {
            if (id != dto.UserId) return BadRequest();
            var existing = await _db.Users.FindAsync(id);
            if (existing == null) return NotFound();
            existing.FullName = dto.FullName;
            existing.Email = dto.Email;
            existing.Role = dto.Role;
            existing.Bio = dto.Bio;
            try
            {
                await _db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _db.Users.AnyAsync(c => c.UserId == id)) return NotFound();
                throw;
            }
            return NoContent();
        }

        /// <summary>
        /// Delete a user.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.Users.FindAsync(id);
            if (item == null) return NotFound();
            _db.Users.Remove(item);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}

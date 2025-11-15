using LogisticSys.Api.Data;
using LogisticSys.Api.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LogisticSys.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class CitiesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CitiesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCities()
        {
            var cities = await _context.Cities.OrderBy(c => c.CityName).ToListAsync();
            return Ok(cities);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCityById(int id)
        {
            var city = await _context.Cities.FindAsync(id);
            if (city == null)
            {
                return NotFound();
            }
            return Ok(city);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCity([FromBody] City city)
        {
            var exists = await _context.Cities.AnyAsync(c => c.CityName == city.CityName);
            if (exists)
            {
                return Conflict(new { message = "A city with this name already exists." });
            }

            try
            {
                _context.Cities.Add(city);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetCityById), new { id = city.CityId }, city);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating city.", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCity(int id, [FromBody] City cityToUpdate)
        {
            if (id != cityToUpdate.CityId)
            {
                return BadRequest("City ID mismatch.");
            }

            var nameExists = await _context.Cities
                .AnyAsync(c => c.CityName == cityToUpdate.CityName && c.CityId != id);
            if (nameExists)
            {
                return Conflict(new { message = "A city with this name already exists." });
            }

            _context.Entry(cityToUpdate).State = EntityState.Modified;

            try
            { 
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Cities.Any(e => e.CityId == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(new { message = "City updated successfully." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCity(int id)
        {
            var city = await _context.Cities.FindAsync(id);
            if (city == null)
            {
                return NotFound();
            }

            var inUse = await _context.Users.AnyAsync(u => u.CityId == id);
            if (inUse)
            {
                return BadRequest(new { message = "Cannot delete city. It is currently assigned to users." });
            }

            _context.Cities.Remove(city);
            await _context.SaveChangesAsync();

            return Ok(new { message = "City deleted successfully." });
        }
    }
}
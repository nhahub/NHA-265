using LogisticSys.Api.Data;
using LogisticSys.Api.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LogisticSys.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class DriversController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DriversController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableDrivers()
        {
            var drivers = await _context.DriverProfiles
                .Include(d => d.User)
                .Where(d => d.Availability == "Available" && d.Status == "Active")
                .Select(d => new AvailableDriverDto
                {
                    DriverId = d.DriverId,
                    Name = d.User.Name,
                    Status = d.Status
                })
                .ToListAsync();

            return Ok(drivers);
        }

    }
}
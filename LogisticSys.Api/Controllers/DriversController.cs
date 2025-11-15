using LogisticSys.Api.Data;
using LogisticSys.Api.Dtos;
using LogisticSys.Api.Entities;
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

        [HttpGet]
        public async Task<IActionResult> GetAllDrivers()
        {
            var drivers = await _context.DriverProfiles
                .Include(d => d.User)
                .Select(d => new DriverDto
                {
                    DriverId = d.DriverId,
                    Name = d.User.Name,
                    Email = d.User.Email,
                    Phone = d.User.Phone,
                    LicenseNumber = d.LicenseNumber ?? "N/A",
                    Status = d.Status,
                    Availability = d.Availability
                })
                .ToListAsync();

            return Ok(drivers);
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

        [HttpPost]
        public async Task<IActionResult> CreateDriver([FromBody] CreateDriverDto createDto)
        {
            var emailExists = await _context.Users.AnyAsync(u => u.Email == createDto.Email);
            if (emailExists)
            {
                return Conflict(new { message = "This email is already registered." });
            }

            var licenseExists = await _context.DriverProfiles.AnyAsync(d => d.LicenseNumber == createDto.LicenseNumber);
            if (licenseExists)
            {
                return Conflict(new { message = "This license number is already registered." });
            }

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(createDto.Password);

            var newUser = new User
            {
                Name = createDto.Name,
                Email = createDto.Email,
                Password = hashedPassword,
                Phone = createDto.Phone,
                Role = "Driver"
            };

            var newDriverProfile = new DriverProfile
            {
                User = newUser,
                LicenseNumber = createDto.LicenseNumber,
                EmploymentDate = DateOnly.FromDateTime(DateTime.UtcNow)
            };

            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();
                _context.DriverProfiles.Add(newDriverProfile);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                var resultDto = new DriverDto
                {
                    DriverId = newUser.UserId,
                    Name = newUser.Name,
                    Email = newUser.Email,
                    Phone = newUser.Phone,
                    LicenseNumber = newDriverProfile.LicenseNumber,
                    Status = newDriverProfile.Status,
                    Availability = newDriverProfile.Availability
                };

                return CreatedAtAction(nameof(GetAllDrivers), new { id = resultDto.DriverId }, resultDto);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Error creating driver.", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDriver(int id, [FromBody] UpdateDriverDto updateDto)
        {
            var driverProfile = await _context.DriverProfiles
                .Include(d => d.User)
                .FirstOrDefaultAsync(d => d.DriverId == id);

            if (driverProfile == null)
            {
                return NotFound();
            }

            var licenseExists = await _context.DriverProfiles
                .AnyAsync(d => d.LicenseNumber == updateDto.LicenseNumber && d.DriverId != id);
            if (licenseExists)
            {
                return Conflict(new { message = "This license number is already registered to another driver." });
            }

            driverProfile.User.Name = updateDto.Name;
            driverProfile.User.Phone = updateDto.Phone;
            driverProfile.LicenseNumber = updateDto.LicenseNumber;
            driverProfile.Status = updateDto.Status;
            driverProfile.Availability = updateDto.Availability;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Driver updated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating driver.", error = ex.Message });
            }
        }
    }
}
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
    public class VehiclesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VehiclesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllVehicles()
        {
            var vehicles = await _context.Vehicles
                .Select(v => new VehicleDto
                {
                    VehicleId = v.VehicleId,
                    PlateNumber = v.PlateNumber,
                    Type = v.Type ?? "Other",
                    Capacity = v.Capacity,
                    Status = v.Status
                })
                .ToListAsync();

            return Ok(vehicles);
        }

        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableVehicles()
        {
            var vehicles = await _context.Vehicles
                .Where(v => v.Status == "Available")
                .Select(v => new AvailableVehicleDto
                {
                    VehicleId = v.VehicleId,
                    PlateNumber = v.PlateNumber,
                    Type = v.Type ?? "Other"
                })
                .ToListAsync();

            return Ok(vehicles);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetVehicleById(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null)
            {
                return NotFound();
            }
            return Ok(vehicle);
        }

        [HttpPost]
        public async Task<IActionResult> CreateVehicle([FromBody] Vehicle vehicle)
        {
            var exists = await _context.Vehicles.AnyAsync(v => v.PlateNumber == vehicle.PlateNumber);
            if (exists)
            {
                return Conflict("A vehicle with this plate number already exists.");
            }

            try
            {
                if (string.IsNullOrEmpty(vehicle.Status))
                {
                    vehicle.Status = "Available";
                }

                _context.Vehicles.Add(vehicle);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetVehicleById), new { id = vehicle.VehicleId }, vehicle);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating vehicle.", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVehicle(int id, [FromBody] Vehicle vehicleToUpdate)
        {
            if (id != vehicleToUpdate.VehicleId)
            {
                return BadRequest("Vehicle ID mismatch.");
            }

            var plateExists = await _context.Vehicles
                .AnyAsync(v => v.PlateNumber == vehicleToUpdate.PlateNumber && v.VehicleId != id);
            if (plateExists)
            {
                return Conflict("A vehicle with this plate number already exists.");
            }

            _context.Entry(vehicleToUpdate).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Vehicles.Any(e => e.VehicleId == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(new { message = "Vehicle updated successfully." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVehicle(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null)
            {
                return NotFound();
            }

            _context.Vehicles.Remove(vehicle);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Vehicle deleted successfully." });
        }
    }
}
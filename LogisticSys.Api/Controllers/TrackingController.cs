using LogisticSys.Api.Data;
using LogisticSys.Api.Dtos;
using LogisticSys.Api.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LogisticSys.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TrackingController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TrackingController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize(Roles = "Driver")]
        public async Task<IActionResult> AddTrackingEntry([FromBody] CreateTrackingDto createDto)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdString, out int driverId))
            {
                return Unauthorized(new { message = "Invalid user ID in token." });
            }

            var shipmentExists = await _context.Shipments
                .AnyAsync(s => s.ShipmentId == createDto.ShipmentId && s.DriverId == driverId);
            if (!shipmentExists)
            {
                return Forbid("You do not have permission to update this shipment.");
            }

            var newTrackingEntry = new Tracking
            {
                ShipmentId = createDto.ShipmentId,
                Location = createDto.Location,
                Status = createDto.Status ?? "On the Way",
                Latitude = createDto.Latitude,
                Longitude = createDto.Longitude,
                Timestamp = DateTime.UtcNow
            };

            try
            {
                _context.Trackings.Add(newTrackingEntry);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Tracking entry added." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error adding tracking entry.", error = ex.Message });
            }
        }

        [HttpGet("{shipmentId}")]
        [Authorize(Roles = "Customer, Admin")]
        public async Task<IActionResult> GetTrackingHistory(int shipmentId)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdString, out int currentUserId))
            {
                return Unauthorized();
            }
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            var shipment = await _context.Shipments
                .FirstOrDefaultAsync(s => s.ShipmentId == shipmentId);
            if (shipment == null)
            {
                return NotFound("Shipment not found.");
            }

            if (userRole == "Customer" && shipment.CustomerId != currentUserId)
            {
                return Forbid("You do not have permission to view this tracking history.");
            }

            var trackingHistory = await _context.Trackings
                .Where(t => t.ShipmentId == shipmentId)
                .OrderByDescending(t => t.Timestamp)
                .Select(t => new TrackingEntryDto
                {
                    Location = t.Location,
                    Status = t.Status,
                    Timestamp = t.Timestamp.ToString("yyyy-MM-dd HH:mm"),
                    Latitude = t.Latitude,
                    Longitude = t.Longitude
                })
                .ToListAsync();

            return Ok(trackingHistory);
        }
    }
}
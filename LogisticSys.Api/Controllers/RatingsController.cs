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
    public class RatingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RatingsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> SubmitRating([FromBody] CreateRatingDto createDto)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdString, out int customerId))
            {
                return Unauthorized(new { message = "Invalid user ID in token." });
            }

            var shipment = await _context.Shipments
                .FirstOrDefaultAsync(s => s.ShipmentId == createDto.ShipmentId);

            if (shipment == null)
            {
                return NotFound("Shipment not found.");
            }

            if (shipment.CustomerId != customerId)
            {
                return Forbid("You can only rate your own shipments.");
            }

            if (shipment.Status != "Delivered")
            {
                return BadRequest(new { message = "You can only rate shipments after they are delivered." });
            }

            var existingRating = await _context.RatingShipments
                .AnyAsync(r => r.ShipmentId == createDto.ShipmentId);

            if (existingRating)
            {
                return Conflict(new { message = "This shipment has already been rated." });
            }

            var newRating = new RatingShipment
            {
                ShipmentId = createDto.ShipmentId,
                RatingValue = createDto.RatingValue,
                Comments = createDto.Comments,
                RatingDate = DateTime.UtcNow
            };

            if (shipment.DriverId.HasValue)
            {
                var driverRating = new RatingDriver
                {
                    DriverId = shipment.DriverId.Value,
                    RatingValue = createDto.RatingValue,
                    Comments = createDto.Comments,
                    RatingDate = DateTime.UtcNow
                };
                _context.RatingDrivers.Add(driverRating);
            }

            try
            {
                _context.RatingShipments.Add(newRating);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Thank you for your feedback!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error submitting rating.", error = ex.Message });
            }
        }
    }
}
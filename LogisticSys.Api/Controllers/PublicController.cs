using LogisticSys.Api.Data;
using LogisticSys.Api.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LogisticSys.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PublicController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PublicController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("track/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> TrackShipment(int id)
        {
            var shipment = await _context.Shipments
                .FirstOrDefaultAsync(s => s.ShipmentId == id);

            if (shipment == null)
            {
                return NotFound(new { message = "Shipment not found." });
            }

            var lastTracking = await _context.Trackings
                .Where(t => t.ShipmentId == id)
                .OrderByDescending(t => t.Timestamp)
                .FirstOrDefaultAsync();

            var publicDto = new PublicShipmentDto
            {
                ShipmentId = shipment.ShipmentId,
                Origin = shipment.Origin,
                Destination = shipment.Destination,
                Status = shipment.Status,

                LastLatitude = lastTracking?.Latitude,
                LastLongitude = lastTracking?.Longitude,
                LastLocationText = lastTracking?.Location,
                LastUpdate = lastTracking?.Timestamp.ToString("yyyy-MM-dd HH:mm")
            };

            return Ok(publicDto);
        }
    }
}
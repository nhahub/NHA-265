using LogisticSys.Api.Entities;
using LogisticSys.Api.Data;
using LogisticSys.Api.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace LogisticSys.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ShipmentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ShipmentsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("my-shipments")]
        public async Task<IActionResult> GetMyShipments()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdString, out int customerId)) { /*...*/ }

            var shipments = await _context.Shipments
                .Where(s => s.CustomerId == customerId)
                .OrderByDescending(s => s.CreatedAt)
                .Select(s => new ShipmentDto
                {
                    ShipmentId = s.ShipmentId,
                    Origin = s.Origin,
                    Destination = s.Destination,
                    Status = s.Status,
                    ScheduledDate = s.ScheduledDate.HasValue ? s.ScheduledDate.Value.ToString("yyyy-MM-dd") : null
                })
                .ToListAsync();

            return Ok(shipments);
        }

        [HttpGet("pending")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetPendingShipments()
        {
            var shipments = await _context.Shipments
                .Include(s => s.Customer).ThenInclude(c => c.User)
                .Where(s => s.Status == "Pending")
                .OrderBy(s => s.CreatedAt)
                .Select(s => new ShipmentDto
                {
                    ShipmentId = s.ShipmentId,
                    Origin = s.Origin,
                    Destination = s.Destination,
                    Status = s.Status,
                    ScheduledDate = s.ScheduledDate.HasValue ? s.ScheduledDate.Value.ToString("yyyy-MM-dd") : null
                })
                .ToListAsync();

            return Ok(shipments);
        }

        [HttpGet("my-jobs")]
        [Authorize(Roles = "Driver")]
        public async Task<IActionResult> GetMyJobs()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdString, out int driverId)) { /*...*/ }

            var shipments = await _context.Shipments
                .Where(s => s.DriverId == driverId && s.Status == "In Transit")
                .OrderBy(s => s.ScheduledDate)
                .Select(s => new ShipmentDto
                {
                    ShipmentId = s.ShipmentId,
                    Origin = s.Origin,
                    Destination = s.Destination,
                    Status = s.Status,
                    ScheduledDate = s.ScheduledDate.HasValue ? s.ScheduledDate.Value.ToString("yyyy-MM-dd") : null
                })
                .ToListAsync();

            return Ok(shipments);
        }

        [HttpPost]
        public async Task<IActionResult> CreateShipment([FromBody] CreateShipmentDto createDto)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdString, out int customerId)) { /*...*/ }

            var newShipment = new Shipment
            {
                CustomerId = customerId,
                Origin = createDto.Origin,
                Destination = createDto.Destination,
                Weight = createDto.Weight,
                Priority = createDto.Priority ?? "Normal",
                Status = "Pending",
                ScheduledDate = createDto.ScheduledDate,
                ScheduledTime = createDto.ScheduledTime,
                CreatedAt = DateTime.UtcNow
            };

            try
            {
                _context.Shipments.Add(newShipment);
                await _context.SaveChangesAsync();

                var resultDto = new ShipmentDto
                {
                    ShipmentId = newShipment.ShipmentId,
                    Origin = newShipment.Origin,
                    Destination = newShipment.Destination,
                    Status = newShipment.Status,
                    ScheduledDate = newShipment.ScheduledDate.HasValue ? newShipment.ScheduledDate.Value.ToString("yyyy-MM-dd") : null
                };

                return CreatedAtAction(nameof(GetMyShipments), new { id = newShipment.ShipmentId }, resultDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error.", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetShipmentById(int id)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdString, out int currentUserId)) { /*...*/ }
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            var query = _context.Shipments
                .Include(s => s.Driver).ThenInclude(d => d!.User)
                .Include(s => s.Vehicle)
                .Where(s => s.ShipmentId == id);

            if (userRole == "Customer") { query = query.Where(s => s.CustomerId == currentUserId); }

            var shipment = await query
                .Select(s => new ShipmentDetailsDto
                {
                    ShipmentId = s.ShipmentId,
                    Origin = s.Origin,
                    Destination = s.Destination,
                    Status = s.Status,
                    Priority = s.Priority,
                    Weight = s.Weight,
                    CreatedAt = s.CreatedAt,
                    ScheduledDate = s.ScheduledDate.HasValue ? s.ScheduledDate.Value.ToString("yyyy-MM-dd") : null,
                    ScheduledTime = s.ScheduledTime.HasValue ? s.ScheduledTime.Value.ToString("HH:mm") : null,
                    DriverName = s.Driver != null ? s.Driver.User.Name : "N/A",
                    VehiclePlateNumber = s.Vehicle != null ? s.Vehicle.PlateNumber : "N/A"
                })
                .FirstOrDefaultAsync();

            if (shipment == null) { /*...*/ }
            return Ok(shipment);
        }

        [HttpPut("{id}/assign")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AssignShipment(int id, [FromBody] AssignShipmentDto assignDto)
        {
            var shipment = await _context.Shipments.FirstOrDefaultAsync(s => s.ShipmentId == id);
            if (shipment == null) { return NotFound(new { message = "Shipment not found." }); }
            if (shipment.Status != "Pending") { return BadRequest(new { message = "Shipment is not pending." }); }

            shipment.DriverId = assignDto.DriverId;
            shipment.VehicleId = assignDto.VehicleId;
            shipment.Status = "In Transit";

            var notificationForDriver = new Notification
            {
                UserId = assignDto.DriverId,
                Message = $"You have been assigned a new shipment (ID: {shipment.ShipmentId}) from {shipment.Origin}.",
                CreatedAt = DateTime.UtcNow
            };
            _context.Notifications.Add(notificationForDriver);

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Shipment assigned successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error.", error = ex.Message });
            }
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Driver")]
        public async Task<IActionResult> UpdateShipmentStatus(int id, [FromBody] UpdateShipmentStatusDto updateDto)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdString, out int driverId)) { /*...*/ }

            var shipment = await _context.Shipments.FirstOrDefaultAsync(s => s.ShipmentId == id);
            if (shipment == null) { return NotFound(new { message = "Shipment not found." }); }
            if (shipment.DriverId != driverId) { return Forbid(); }

            var allowedStatuses = new[] { "Delivered", "Cancelled" };
            if (!allowedStatuses.Contains(updateDto.NewStatus)) { /*...*/ }

            try
            {
                shipment.Status = updateDto.NewStatus;

                if (updateDto.NewStatus == "Delivered")
                {
                    var notificationForCustomer = new Notification
                    {
                        UserId = shipment.CustomerId,
                        Message = $"Your shipment (ID: {shipment.ShipmentId}) to {shipment.Destination} has been delivered!",
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.Notifications.Add(notificationForCustomer);
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = $"Shipment status updated to {updateDto.NewStatus}." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating status.", error = ex.Message });
            }
        }
    }
}
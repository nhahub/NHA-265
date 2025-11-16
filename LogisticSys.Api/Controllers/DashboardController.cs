using LogisticSys.Api.Data;
using LogisticSys.Api.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace LogisticSys.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            try
            {

                var pendingShipments = await _context.Shipments
                    .CountAsync(s => s.Status == "Pending");

                var inTransitShipments = await _context.Shipments
                    .CountAsync(s => s.Status == "In Transit");

                var availableDrivers = await _context.DriverProfiles
                    .CountAsync(d => d.Availability == "Available" && d.Status == "Active");

                var availableVehicles = await _context.Vehicles
                    .CountAsync(v => v.Status.ToLower() == "available");

                var totalRevenue = await _context.Payments
                    .Where(p => p.PaymentStatus == "Completed")
                    .SumAsync(p => p.Amount);

                var stats = new DashboardStatsDto
                {
                    PendingShipments = pendingShipments,
                    InTransitShipments = inTransitShipments,
                    AvailableDrivers = availableDrivers,
                    AvailableVehicles = availableVehicles,
                    TotalRevenue = totalRevenue
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching dashboard stats.", error = ex.Message });
            }
        }
    }
}
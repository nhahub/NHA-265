using LogisticSys.Api.Data;
using LogisticSys.Api.Dtos;
using LogisticSys.Api.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Linq;

namespace LogisticSys.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PaymentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PaymentsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{shipmentId}")]
        [Authorize(Roles = "Customer, Admin")]
        public async Task<IActionResult> GetPaymentsForShipment(int shipmentId)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdString, out int currentUserId)) { /*...*/ }
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            var shipment = await _context.Shipments.FirstOrDefaultAsync(s => s.ShipmentId == shipmentId);
            if (shipment == null) { /*...*/ }

            if (userRole == "Customer" && shipment.CustomerId != currentUserId) { /*...*/ }

            var payments = await _context.Payments
                .Where(p => p.ShipmentId == shipmentId)
                .OrderByDescending(p => p.PaymentDate)
                .Select(p => new PaymentDto { /* ... */ })
                .ToListAsync();

            return Ok(payments);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateOrUpdatePayment([FromBody] CreateOrUpdatePaymentDto createDto)
        {
            var shipmentExists = await _context.Shipments.AnyAsync(s => s.ShipmentId == createDto.ShipmentId);
            if (!shipmentExists)
            {
                return NotFound(new { message = "Shipment not found." });
            }

            var existingPayment = await _context.Payments
                .FirstOrDefaultAsync(p => p.ShipmentId == createDto.ShipmentId);

            try
            {
                if (existingPayment != null)
                {
                    existingPayment.Amount = createDto.Amount;
                    existingPayment.PaymentMethod = createDto.PaymentMethod;
                    existingPayment.PaymentStatus = createDto.PaymentStatus;
                    existingPayment.PaymentDate = DateTime.UtcNow;
                }
                else
                {
                    var newPayment = new Payment
                    {
                        ShipmentId = createDto.ShipmentId,
                        Amount = createDto.Amount,
                        PaymentMethod = createDto.PaymentMethod,
                        PaymentStatus = createDto.PaymentStatus,
                        PaymentDate = DateTime.UtcNow
                    };
                    _context.Payments.Add(newPayment);
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = "Payment updated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating payment.", error = ex.Message });
            }
        }
    }
}
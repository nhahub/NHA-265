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
            if (!int.TryParse(userIdString, out int currentUserId))
            {
                return Unauthorized();
            }
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            var shipment = await _context.Shipments.FirstOrDefaultAsync(s => s.ShipmentId == shipmentId);

            if (shipment == null)
            {
                return NotFound("Shipment not found.");
            }

            if (userRole == "Customer" && shipment.CustomerId != currentUserId)
            {
                return Forbid("You do not have permission to view these payments.");
            }

            var payments = await _context.Payments
                .Where(p => p.ShipmentId == shipmentId)
                .OrderByDescending(p => p.PaymentDate)
                .Select(p => new PaymentDto
                {
                    PaymentId = p.PaymentId,
                    Amount = p.Amount,
                    PaymentMethod = p.PaymentMethod ?? "N/A",
                    PaymentStatus = p.PaymentStatus,
                    PaymentDate = p.PaymentDate.ToString("yyyy-MM-dd HH:mm")
                })
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

        [HttpPost("pay/{paymentId}")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> PayForShipment(int paymentId)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdString, out int customerId))
            {
                return Unauthorized();
            }

            var payment = await _context.Payments
                .Include(p => p.Shipment)
                .FirstOrDefaultAsync(p => p.PaymentId == paymentId);

            if (payment == null)
            {
                return NotFound(new { message = "Payment request not found." });
            }

            if (payment.Shipment.CustomerId != customerId)
            {
                return Forbid("You can only pay for your own shipments.");
            }

            if (payment.PaymentStatus == "Completed")
            {
                return Conflict(new { message = "This payment is already completed." });
            }

            try
            {
                payment.PaymentStatus = "Completed";
                payment.PaymentMethod = "Online";
                payment.PaymentDate = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { message = "Payment successful!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error processing payment.", error = ex.Message });
            }
        }
    }
}
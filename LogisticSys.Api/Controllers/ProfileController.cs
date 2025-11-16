using LogisticSys.Api.Data;
using LogisticSys.Api.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LogisticSys.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProfileController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdString, out int userId))
            {
                return Unauthorized();
            }

            var user = await _context.Users
                .Include(u => u.CustomerProfile)
                .Include(u => u.DriverProfile)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            var profileDto = new ProfileDto
            {
                Name = user.Name,
                Email = user.Email,
                Phone = user.Phone,
                Role = user.Role,
                Address = user.CustomerProfile?.Address,
                LicenseNumber = user.DriverProfile?.LicenseNumber
            };

            return Ok(profileDto);
        }


        [HttpPut("me")]
        public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateProfileDto updateDto)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdString, out int userId))
            {
                return Unauthorized();
            }

            var user = await _context.Users
                .Include(u => u.CustomerProfile)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            user.Name = updateDto.Name;
            user.Phone = updateDto.Phone;

            if (user.Role == "Customer" && user.CustomerProfile != null)
            {
                user.CustomerProfile.Address = updateDto.Address;
            }

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Profile updated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating profile.", error = ex.Message });
            }
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto changeDto)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdString, out int userId))
            {
                return Unauthorized();
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            if (!BCrypt.Net.BCrypt.Verify(changeDto.OldPassword, user.Password))
            {
                return BadRequest(new { message = "Incorrect old password." });
            }

            string newHashedPassword = BCrypt.Net.BCrypt.HashPassword(changeDto.NewPassword);
            user.Password = newHashedPassword;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Password changed successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error changing password.", error = ex.Message });
            }
        }
    }
}
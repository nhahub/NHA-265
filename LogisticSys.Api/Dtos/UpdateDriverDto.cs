using System.ComponentModel.DataAnnotations;

namespace LogisticSys.Api.Dtos
{
    public class UpdateDriverDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(20)]
        public string? Phone { get; set; }

        [Required]
        [StringLength(50)]
        public string LicenseNumber { get; set; } = string.Empty;

        [Required]
        public string Status { get; set; } = string.Empty;

        [Required]
        public string Availability { get; set; } = string.Empty;
    }
}
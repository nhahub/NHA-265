using System.ComponentModel.DataAnnotations;

namespace LogisticSys.Api.Dtos
{
    public class CreateShipmentDto
    {
        [Required]
        [StringLength(255)]
        public string Origin { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string Destination { get; set; } = string.Empty;

        [Range(0.1, 10000)]
        public decimal? Weight { get; set; }

        [StringLength(20)]
        public string? Priority { get; set; }

        public DateOnly? ScheduledDate { get; set; }

        public TimeOnly? ScheduledTime { get; set; }
    }
}
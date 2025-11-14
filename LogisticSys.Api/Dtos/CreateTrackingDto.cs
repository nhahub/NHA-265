using System.ComponentModel.DataAnnotations;

namespace LogisticSys.Api.Dtos
{
    public class CreateTrackingDto
    {
        [Required]
        public int ShipmentId { get; set; }

        [Required]
        [StringLength(255)]
        public string Location { get; set; } = string.Empty;

        [StringLength(20)]
        public string? Status { get; set; }

        [Range(-90, 90)]
        public decimal? Latitude { get; set; }

        [Range(-180, 180)]
        public decimal? Longitude { get; set; }
    }
}
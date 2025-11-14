using System.ComponentModel.DataAnnotations;

namespace LogisticSys.Api.Dtos
{
    public class CreateRatingDto
    {
        [Required]
        public int ShipmentId { get; set; }

        [Required]
        [Range(1, 5)]
        public decimal RatingValue { get; set; }

        [StringLength(500)]
        public string? Comments { get; set; }
    }
}
using System.ComponentModel.DataAnnotations;

namespace LogisticSys.Api.Dtos
{
    public class CreateOrUpdatePaymentDto
    {
        [Required]
        public int ShipmentId { get; set; }

        [Required]
        [Range(1, 1000000)]
        public decimal Amount { get; set; }

        [Required]
        [StringLength(20)]
        public string PaymentMethod { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string PaymentStatus { get; set; } = string.Empty;
    }
}
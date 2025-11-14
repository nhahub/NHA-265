using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LogisticSys.Api.Entities
{
    [Table("Payments")]
    public class Payment
    {
        [Key]
        [Column("payment_id")]
        public int PaymentId { get; set; }

        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal Amount { get; set; }

        [StringLength(20)]
        [Column("payment_method")]
        public string? PaymentMethod { get; set; }

        [StringLength(20)]
        [Column("payment_status")]
        public string PaymentStatus { get; set; } = "Pending";

        [Column("payment_date")]
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;

        [Column("shipment_id")]
        public int ShipmentId { get; set; }

        [ForeignKey("ShipmentId")]
        public Shipment Shipment { get; set; } = null!;
    }
}
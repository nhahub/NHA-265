using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LogisticSys.Api.Entities
{
    [Table("Tracking")]
    public class Tracking
    {
        [Key]
        [Column("tracking_id")]
        public int TrackingId { get; set; }

        [Required]
        [StringLength(255)]
        public string Location { get; set; } = string.Empty;

        [StringLength(20)]
        public string Status { get; set; } = "On the Way";

        [Column(TypeName = "decimal(9, 6)")]
        public decimal? Latitude { get; set; }

        [Column(TypeName = "decimal(9, 6)")]
        public decimal? Longitude { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        [Column("shipment_id")]
        public int ShipmentId { get; set; }

        [ForeignKey("ShipmentId")]
        public Shipment Shipment { get; set; } = null!;
    }
}
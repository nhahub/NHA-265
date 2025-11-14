using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LogisticSys.Api.Entities
{
    [Table("Rating_Shipment")]
    public class RatingShipment
    {
        [Key]
        [Column("rating_shipment_id")]
        public int RatingShipmentId { get; set; }

        [Column("rating_value", TypeName = "decimal(2, 1)")]
        public decimal? RatingValue { get; set; }

        [StringLength(500)]
        public string? Comments { get; set; }

        [Column("rating_date")]
        public DateTime RatingDate { get; set; } = DateTime.UtcNow;

        [Column("shipment_id")]
        public int ShipmentId { get; set; }

        [ForeignKey("ShipmentId")]
        public Shipment Shipment { get; set; } = null!;
    }
}
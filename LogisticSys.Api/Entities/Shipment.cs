using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LogisticSys.Api.Entities
{
    [Table("Shipments")]
    public class Shipment
    {
        [Key]
        [Column("shipment_id")]
        public int ShipmentId { get; set; }

        [Required]
        [StringLength(255)]
        public string Origin { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string Destination { get; set; } = string.Empty;

        [Column(TypeName = "decimal(10, 2)")]
        public decimal? Weight { get; set; }

        [StringLength(20)]
        public string Status { get; set; } = "Pending";

        [StringLength(20)]
        public string Priority { get; set; } = "Normal";

        [Column("scheduled_date")]
        public DateOnly? ScheduledDate { get; set; }

        [Column("scheduled_time")]
        public TimeOnly? ScheduledTime { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("customer_id")]
        public int CustomerId { get; set; }

        [ForeignKey("CustomerId")]
        public CustomerProfile Customer { get; set; } = null!;

        [Column("driver_id")]
        public int? DriverId { get; set; }

        [ForeignKey("DriverId")]
        public DriverProfile? Driver { get; set; }

        [Column("vehicle_id")]
        public int? VehicleId { get; set; }

        [ForeignKey("VehicleId")]
        public Vehicle? Vehicle { get; set; }

        public ICollection<Tracking> Trackings { get; set; } = new List<Tracking>();

        public ICollection<Payment> Payments { get; set; } = new List<Payment>();

        public ICollection<RatingShipment> Ratings { get; set; } = new List<RatingShipment>();
    }
}
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LogisticSys.Api.Entities
{
    [Table("Vehicles")]
    public class Vehicle
    {
        [Key]
        [Column("vehicle_id")]
        public int VehicleId { get; set; }

        [Required]
        [StringLength(20)]
        [Column("plate_number")]
        public string PlateNumber { get; set; } = string.Empty;

        [StringLength(20)]
        public string? Type { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        public decimal? Capacity { get; set; }

        [StringLength(20)]
        public string Status { get; set; } = "Available";

        public DriverProfile? DriverProfile { get; set; }

        public ICollection<Shipment> Shipments { get; set; } = new List<Shipment>();
    }
}
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LogisticSys.Api.Entities
{
    [Table("Driver_Profile")]
    public class DriverProfile
    {
        [Key]
        [Column("driver_id")]
        public int DriverId { get; set; }

        [StringLength(50)]
        [Column("license_number")]
        public string? LicenseNumber { get; set; }

        [Column("employment_date")]
        public DateOnly? EmploymentDate { get; set; }

        [StringLength(20)]
        public string Status { get; set; } = "Active";

        [StringLength(20)]
        public string Availability { get; set; } = "Available";

        [Column("vehicle_id")]
        public int? VehicleId { get; set; }

        [ForeignKey("DriverId")]
        public User User { get; set; } = null!;


        [ForeignKey("VehicleId")]
        public Vehicle? Vehicle { get; set; }

        public ICollection<Shipment> Shipments { get; set; } = new List<Shipment>();

        public ICollection<RatingDriver> Ratings { get; set; } = new List<RatingDriver>();
    }
}
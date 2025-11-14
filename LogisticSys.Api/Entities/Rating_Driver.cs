using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LogisticSys.Api.Entities
{
    [Table("Rating_Driver")]
    public class RatingDriver
    {
        [Key]
        [Column("rating_driver_id")]
        public int RatingDriverId { get; set; }

        [Column("rating_value", TypeName = "decimal(2, 1)")]
        public decimal? RatingValue { get; set; }

        [StringLength(500)]
        public string? Comments { get; set; }

        [Column("rating_date")]
        public DateTime RatingDate { get; set; } = DateTime.UtcNow;

        [Column("driver_id")]
        public int DriverId { get; set; }

        [ForeignKey("DriverId")]
        public DriverProfile Driver { get; set; } = null!;
    }
}
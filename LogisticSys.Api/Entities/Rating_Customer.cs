using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LogisticSys.Api.Entities
{
    [Table("Rating_Customer")]
    public class RatingCustomer
    {
        [Key]
        [Column("rating_customer_id")]
        public int RatingCustomerId { get; set; }

        [Column("rating_value", TypeName = "decimal(2, 1)")]
        public decimal? RatingValue { get; set; }

        [StringLength(500)]
        public string? Comments { get; set; }

        [Column("rating_date")]
        public DateTime RatingDate { get; set; } = DateTime.UtcNow;

        [Column("customer_id")]
        public int CustomerId { get; set; }

        [ForeignKey("CustomerId")]
        public CustomerProfile Customer { get; set; } = null!;
    }
}
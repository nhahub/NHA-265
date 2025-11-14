using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LogisticSys.Api.Entities
{
    [Table("Customer_Profile")]
    public class CustomerProfile
    {
        [Key]
        [Column("customer_id")]
        public int CustomerId { get; set; }

        public string? Address { get; set; }

        [StringLength(150)]
        [Column("company_name")]
        public string? CompanyName { get; set; }

        [StringLength(20)]
        [Column("preferred_payment_method")]
        public string? PreferredPaymentMethod { get; set; }

        [ForeignKey("CustomerId")]
        public User User { get; set; } = null!;


        public ICollection<Shipment> Shipments { get; set; } = new List<Shipment>();

        public ICollection<RatingCustomer> Ratings { get; set; } = new List<RatingCustomer>();
    }
}
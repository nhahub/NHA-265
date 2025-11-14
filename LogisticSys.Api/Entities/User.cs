using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LogisticSys.Api.Entities
{
    [Table("Users")]
    public class User
    {
        [Key]
        [Column("user_id")]
        public int UserId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string Password { get; set; } = string.Empty;

        [StringLength(20)]
        public string? Phone { get; set; }

        [Required]
        [StringLength(20)]
        public string Role { get; set; } = string.Empty;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("city_id")]
        public int? CityId { get; set; }


        [ForeignKey("CityId")]
        public City? City { get; set; }


        public AdminProfile? AdminProfile { get; set; }
        public CustomerProfile? CustomerProfile { get; set; }
        public DriverProfile? DriverProfile { get; set; }

        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    }
}
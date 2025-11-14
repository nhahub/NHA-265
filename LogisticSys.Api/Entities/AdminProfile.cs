using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LogisticSys.Api.Entities
{
    [Table("Admin_Profile")]
    public class AdminProfile
    {
        [Key]
        [Column("admin_id")]
        public int AdminId { get; set; }

        [StringLength(100)]
        public string? Department { get; set; }

        [StringLength(50)]
        [Column("permissions_level")]
        public string? PermissionsLevel { get; set; }

        [ForeignKey("AdminId")]
        public User User { get; set; } = null!;
    }
}
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LogisticSys.Api.Entities
{
    [Table("Cities")]
    public class City
    {

        [Key]
        [Column("city_id")]
        public int CityId { get; set; }

        [Required]
        [StringLength(100)]
        [Column("city_name")]
        public string CityName { get; set; } = string.Empty;

        [StringLength(100)]
        public string? Region { get; set; }

        public ICollection<User> Users { get; set; } = new List<User>();
    }
}
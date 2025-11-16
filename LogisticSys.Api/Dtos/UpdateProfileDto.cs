using System.ComponentModel.DataAnnotations;

namespace LogisticSys.Api.Dtos
{
    public class UpdateProfileDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(20)]
        public string? Phone { get; set; }

        public string? Address { get; set; }
    }
}
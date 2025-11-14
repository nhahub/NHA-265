using System.ComponentModel.DataAnnotations;

namespace LogisticSys.Api.Dtos
{
    public class LoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Pass { get; set; } = string.Empty;
    }
}
using System.ComponentModel.DataAnnotations;

namespace LogisticSys.Api.Dtos
{
    public class UpdateShipmentStatusDto
    {
        [Required]
        [StringLength(20)]
        public string NewStatus { get; set; } = string.Empty;
    }
}
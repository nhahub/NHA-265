using System.ComponentModel.DataAnnotations;

namespace LogisticSys.Api.Dtos
{
    public class AssignShipmentDto
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int DriverId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int VehicleId { get; set; }
    }
}
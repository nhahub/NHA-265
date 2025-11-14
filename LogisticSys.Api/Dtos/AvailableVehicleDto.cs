namespace LogisticSys.Api.Dtos
{
    public class AvailableVehicleDto
    {
        public int VehicleId { get; set; }
        public string PlateNumber { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
    }
}
namespace LogisticSys.Api.Dtos
{
    public class VehicleDto
    {
        public int VehicleId { get; set; }
        public string PlateNumber { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public decimal? Capacity { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
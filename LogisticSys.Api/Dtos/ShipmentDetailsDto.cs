namespace LogisticSys.Api.Dtos
{
    public class ShipmentDetailsDto
    {
        public int ShipmentId { get; set; }
        public string Origin { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public decimal? Weight { get; set; }
        public DateTime CreatedAt { get; set; }

        public string? ScheduledDate { get; set; }
        public string? ScheduledTime { get; set; }

        public string? DriverName { get; set; }
        public string? VehiclePlateNumber { get; set; }
    }
}
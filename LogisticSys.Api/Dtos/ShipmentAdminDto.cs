namespace LogisticSys.Api.Dtos
{
    public class ShipmentAdminDto
    {
        public int ShipmentId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string DriverName { get; set; } = string.Empty;
        public string Origin { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? ScheduledDate { get; set; }
    }
}
namespace LogisticSys.Api.Dtos
{
    public class ShipmentDto
    {
        public int ShipmentId { get; set; }
        public int CustomerId { get; set; }
        public string Origin { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? ScheduledDate { get; set; }
    }
}
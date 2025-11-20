namespace LogisticSys.Api.Dtos
{
    public class PublicShipmentDto
    {
        public int ShipmentId { get; set; }
        public string Origin { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;

        public decimal? LastLatitude { get; set; }
        public decimal? LastLongitude { get; set; }
        public string? LastLocationText { get; set; }
        public string? LastUpdate { get; set; }
    }
}
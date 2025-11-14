namespace LogisticSys.Api.Dtos
{
    public class TrackingEntryDto
    {
        public string Location { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Timestamp { get; set; } = string.Empty;
    }
}